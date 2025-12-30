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
    cursor.execute("SHOW TABLES;")
    rows = cursor.fetchall()
    print("Tables:")
    for row in rows:
        print(row[0])
