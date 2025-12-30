import os
import django
import sys
from pathlib import Path

# Setup Django
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from knowledge.views import KnowledgeBaseViewSet
from rest_framework.test import APIRequestFactory, force_authenticate
from users.models import User

def debug_api_call():
    factory = APIRequestFactory()
    view = KnowledgeBaseViewSet.as_view({'get': 'list'})
    
    # Create a request
    request = factory.get('/api/knowledge-base/')
    
    # Authenticate (optional, but let's try with an admin)
    user = User.objects.filter(role=1).first()
    if user:
        force_authenticate(request, user=user)
    
    print(f"Calling KnowledgeBaseViewSet.list as {user.username if user else 'Anonymous'}...")
    try:
        response = view(request)
        print(f"Status Code: {response.status_code}")
        if response.status_code >= 400:
            print(f"Response Data: {response.data}")
    except Exception as e:
        import traceback
        print("❌ View execution failed with traceback:")
        traceback.print_exc()

if __name__ == "__main__":
    debug_api_call()
