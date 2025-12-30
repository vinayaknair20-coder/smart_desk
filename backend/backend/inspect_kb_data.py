import os
import django
import sys
from pathlib import Path

# Setup Django
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from knowledge.models import KnowledgeBase

articles = KnowledgeBase.objects.all()
print(f"Total articles: {articles.count()}")

for a in articles:
    try:
        print(f"\nID: {a.id}")
        print(f"Title: {a.title}")
        print(f"Created By: {a.created_by}")
        print(f"Embedding length: {len(a.embedding) if a.embedding else 'None'}")
        print(f"Is Active: {a.is_active}")
    except Exception as e:
        print(f"❌ Error accessing article {a.id}: {e}")
