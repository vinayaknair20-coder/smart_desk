import os
import django
import sys
from pathlib import Path
from dotenv import load_dotenv
import time

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(env_path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from knowledge.models import KnowledgeBase
from knowledge.utils import generate_embedding

print("🔄 Regenerating embeddings for all KB articles...")

articles = KnowledgeBase.objects.filter(is_active=True)
print(f"Found {articles.count()} active articles")

for article in articles:
    if not article.embedding:
        print(f"\n📝 Processing: {article.title}")
        full_text = f"{article.title}\n\n{article.content}"
        
        # Retry logic for rate limits
        for attempt in range(3):
            embedding = generate_embedding(full_text)
            if embedding:
                article.embedding = embedding
                article.save()
                print(f"   ✅ Embedding generated ({len(embedding)} dimensions)")
                break
            else:
                print(f"   ⚠️ Attempt {attempt+1} failed. waiting 65s for quota reset...")
                time.sleep(65)
        
        print("   💤 Waiting 65s before next article...")
        time.sleep(65)  # Standard delay between articles
    else:
        print(f"✓ {article.title} - Already has embedding")

print("\n✅ Done! All articles processed.")
