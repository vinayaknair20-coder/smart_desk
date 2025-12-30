import os
import django
import sys
from pathlib import Path

# Setup Django
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.db import connection

sql_commands = [
    "DROP VIEW IF EXISTS knowledge_base;",
    "CREATE VIEW knowledge_base AS SELECT * FROM knowledge_knowledgebase;",
    "DROP VIEW IF EXISTS canned_responses;",
    "CREATE VIEW canned_responses AS SELECT * FROM knowledge_cannedresponse;"
]

print("Creating compatibility views...")
with connection.cursor() as cursor:
    for sql in sql_commands:
        try:
            cursor.execute(sql)
            print(f"✅ Executed: {sql[:30]}...")
        except Exception as e:
            print(f"❌ Failed: {sql[:30]}... Error: {e}")

print("\nDone! Now Port 8000 should find the data even if using old code.")
