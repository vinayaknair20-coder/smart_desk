import os
import django
import sys
from pathlib import Path
from django.db import connection

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

with connection.cursor() as cursor:
    cursor.execute("DROP TABLE IF EXISTS knowledge_knowledgebase;")
    cursor.execute("DROP TABLE IF EXISTS knowledge_cannedresponse;")
    cursor.execute("DROP TABLE IF EXISTS canned_responses;") 
    cursor.execute("DELETE FROM django_migrations WHERE app='knowledge';")
    print("Dropped knowledge tables and cleared migration history.")
