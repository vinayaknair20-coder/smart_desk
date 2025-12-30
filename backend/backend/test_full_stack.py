import os
import django
import sys
from pathlib import Path

# Setup Django
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.conf import settings
if 'testserver' not in settings.ALLOWED_HOSTS:
    settings.ALLOWED_HOSTS.append('testserver')

from django.test import Client
from users.models import User

def debug_full_request():
    client = Client()
    user = User.objects.filter(role=1).first()
    if user:
        client.force_login(user)
    
    print(f"GET /api/knowledge-base/ through Client (as {user.username if user else 'Anon'})...")
    try:
        response = client.get('/api/knowledge-base/')
        print(f"Status Code: {response.status_code}")
        if response.status_code == 500:
            # Try to get the exception from the response if it's available in test mode
            # Standard Client doesn't give traceback but we might see it in the content
            print(f"Content length: {len(response.content)}")
            print(f"Content: {response.content[:500]}")
    except Exception as e:
        import traceback
        print("❌ Client request failed with traceback:")
        traceback.print_exc()

if __name__ == "__main__":
    debug_full_request()
