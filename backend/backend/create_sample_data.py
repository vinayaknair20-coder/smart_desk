import os
import django
import sys
import random
from datetime import timedelta
from django.utils import timezone
from pathlib import Path

# Setup Django
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from tickets.models import Ticket, SLATime, CommentThread, Comment
from knowledge.models import KnowledgeBase

def create_sample_data():
    print("🚀 Creating sample data...")

    # 1. Create Agents if they don't exist
    agents_data = [
        {"username": "agent_alice", "email": "alice@example.com", "role": 3},
        {"username": "agent_bob", "email": "bob@example.com", "role": 3},
        {"username": "agent_charlie", "email": "charlie@example.com", "role": 3},
    ]
    agents = []
    for data in agents_data:
        user, created = User.objects.get_or_create(username=data["username"], defaults={
            "email": data["email"],
            "role": data["role"]
        })
        if created:
            user.set_password("password123")
            user.save()
            print(f"   Created agent: {user.username}")
        agents.append(user)

    # 2. Get standard user for ticket creation
    customer, _ = User.objects.get_or_create(username="customer_user", defaults={"email": "customer@example.com", "role": 2})
    if _: customer.set_password("password123"); customer.save()

    # 3. Ensure SLA settings exist
    sla_high, _ = SLATime.objects.get_or_create(priority_id=1, defaults={"sla_time_minutes": 60}) # 1 hour
    sla_med, _ = SLATime.objects.get_or_create(priority_id=2, defaults={"sla_time_minutes": 240}) # 4 hours
    sla_low, _ = SLATime.objects.get_or_create(priority_id=3, defaults={"sla_time_minutes": 1440}) # 24 hours

    # 4. Create Tickets
    subjects = [
        ("VPN connecting issues", 2), # IT
        ("New monitor request", 2),
        ("HR benefits inquiry", 1), # HR
        ("Leaking faucet", 3), # Facilities
        ("Software license renewal", 2),
        ("Office chair replacement", 3),
        ("Payroll discrepancy", 1),
        ("Email password reset", 2),
        ("Conference room booking", 4), # Other
    ]

    for i in range(20):
        sub, queue = random.choice(subjects)
        priority = random.choice([1, 2, 3])
        status = random.choice([1, 2]) # Open or Closed
        assigned_agent = random.choice(agents) if status == 2 or random.random() > 0.3 else None
        
        # Random creation time in the last 7 days
        days_ago = random.randint(0, 7)
        hours_ago = random.randint(0, 23)
        created_at = timezone.now() - timedelta(days=days_ago, hours=hours_ago)
        
        ticket = Ticket.objects.create(
            subject=f"{sub} #{i+100}",
            description=f"Automated sample description for {sub}. Priority {priority}.",
            created_user=customer,
            assigned_user=assigned_agent,
            queue=queue,
            priority_id=priority,
            status=status,
            creation_time=created_at,
            sla_time=SLATime.objects.get(priority_id=priority)
        )
        
        thread, _ = CommentThread.objects.get_or_create(ticket=ticket)
        
        if status == 2: # Closed
            # Add an agent comment to simulate resolution
            # For SLA compliance test: some met, some missed
            met_sla = random.random() > 0.3
            if met_sla:
                resolution_time = random.randint(5, ticket.sla_time.sla_time_minutes - 1)
            else:
                resolution_time = random.randint(ticket.sla_time.sla_time_minutes + 1, 3000)
            
            resolved_at = created_at + timedelta(minutes=resolution_time)
            
            Comment.objects.create(
                thread=thread,
                user=assigned_agent or agents[0],
                comment=f"Ticket resolved in {resolution_time} minutes.",
                comment_time=resolved_at
            )
            print(f"   Created closed ticket #{ticket.id} (Met SLA: {met_sla})")
        else:
            print(f"   Created open ticket #{ticket.id}")

    print("✅ Sample data creation complete!")

if __name__ == "__main__":
    create_sample_data()
