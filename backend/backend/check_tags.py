import os
import django
import sys
from pathlib import Path

# Setup Django
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from knowledge.models import KnowledgeBase, CannedResponse

print("--- KB Articles ---")
for kb in KnowledgeBase.objects.all():
    print(f"ID: {kb.id}, Title: {kb.title}, Tags: {repr(kb.tags)}")

print("\n--- Canned Responses ---")
for c in CannedResponse.objects.all():
    print(f"ID: {c.id}, Title: {c.title}, Search Tags: {repr(c.search_tags)}")
