import os
import django
import sys
from pathlib import Path
from django.db import connection

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from knowledge.models import KnowledgeBase, CannedResponse
from tickets.models import Ticket, SLATime
from users.models import User

print(f"Users: {User.objects.count()}")
print(f"Tickets: {Ticket.objects.count()}")
print(f"KB Articles (Active): {KnowledgeBase.objects.filter(is_active=True).count()}")
print(f"KB Articles (Inactive): {KnowledgeBase.objects.filter(is_active=False).count()}")
print(f"KB Articles w/ Embeddings: {KnowledgeBase.objects.filter(embedding__isnull=False).count()}")
print(f"Canned Responses: {CannedResponse.objects.count()}")
print(f"SLA Settings: {SLATime.objects.count()}")
