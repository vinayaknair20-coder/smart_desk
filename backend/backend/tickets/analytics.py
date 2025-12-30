from django.utils import timezone
from .models import Ticket, Comment, SLATime

def calculate_sla_compliance():
    """Returns the percentage of closed tickets that met their SLA."""
    closed_tickets = Ticket.objects.filter(status=2) # 2 = Closed
    if not closed_tickets.exists():
        return 0
    
    met_sla_count = 0
    for ticket in closed_tickets:
        if not ticket.sla_time:
            continue
            
        # Check if first response or resolution met SLA? 
        # Usually resolution for final compliance.
        created = ticket.creation_time
        # For simplicity, we assume the last comment time or a hypothetical resolved_at
        # Since we don't have a resolved_at field, we'll use the last comment time for closed tickets
        last_comment = Comment.objects.filter(thread__ticket=ticket).order_by('-comment_time').first()
        if last_comment:
            duration = (last_comment.comment_time - created).total_seconds() / 60
            if duration <= ticket.sla_time.sla_time_minutes:
                met_sla_count += 1
                
    return round((met_sla_count / closed_tickets.count()) * 100, 1)

def calculate_fcr_rate():
    """First Contact Resolution: Ticket closed after exactly one agent response."""
    closed_tickets = Ticket.objects.filter(status=2)
    if not closed_tickets.exists():
        return 0
        
    fcr_count = 0
    for ticket in closed_tickets:
        agent_comments = Comment.objects.filter(thread__ticket=ticket, user__role=3) # Role 3 = Agent
        if agent_comments.count() == 1:
            fcr_count += 1
            
    return round((fcr_count / closed_tickets.count()) * 100, 1)

def get_workload_stats():
    """Returns a list of agents and their active ticket counts."""
    from users.models import User
    agents = User.objects.filter(role=3)
    stats = []
    for agent in agents:
        count = Ticket.objects.filter(assigned_user=agent, status=1).count()
        stats.append({
            "username": agent.username,
            "count": count
        })
    return stats
