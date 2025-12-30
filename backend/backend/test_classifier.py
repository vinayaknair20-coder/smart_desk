import os
import django
import sys
from pathlib import Path
from dotenv import load_dotenv

# Setup Django Environment
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

# Explicitly load .env
env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(env_path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from tickets.ai_classifier import classify_ticket

# Debug 
api_key = os.getenv("GEMINI_API_KEY")
print(f"DEBUG: API Key present? {bool(api_key)}")
if api_key:
    print(f"DEBUG: Key starts with: {api_key[:8]}...")

# Test Cases
test_cases = [
    ("The office is melting", "The air conditioning has been off for 3 days and it is 40 degrees in here."),
]

print("\n" + "="*30)
print("🔍 Testing Classifier...")
print("="*30)
for subject, desc in test_cases:
    print(f"\n--- Testing: {subject} ---")
    result = classify_ticket(subject, desc)
    import json
    print(f"Result: {json.dumps(result, indent=2)}")
print("\n" + "="*30)
