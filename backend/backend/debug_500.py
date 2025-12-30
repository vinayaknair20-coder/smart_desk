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
from knowledge.serializers import KnowledgeBaseSerializer, CannedResponseSerializer
from rest_framework.request import Request
from rest_framework.test import APIRequestFactory

def debug_kb():
    print("--- Debugging KB ---")
    try:
        articles = KnowledgeBase.objects.filter(is_active=True)
        print(f"Found {articles.count()} active articles.")
        
        # Try to serialize
        serializer = KnowledgeBaseSerializer(articles, many=True)
        print("Serialization started...")
        data = serializer.data
        print("Serialization successful.")
        if data:
            print(f"First article sample: {json.dumps(data[0], indent=2)}")
    except Exception as e:
        import traceback
        print("❌ Error during KB debugging:")
        traceback.print_exc()

def debug_canned():
    print("\n--- Debugging Canned ---")
    try:
        responses = CannedResponse.objects.all()
        print(f"Found {responses.count()} responses.")
        
        serializer = CannedResponseSerializer(responses, many=True)
        print("Serialization started...")
        data = serializer.data
        print("Serialization successful.")
    except Exception as e:
        import traceback
        print("❌ Error during Canned debugging:")
        traceback.print_exc()

if __name__ == "__main__":
    debug_kb()
    debug_canned()
