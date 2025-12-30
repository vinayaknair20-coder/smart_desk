import os
import django
import sys
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
env_path = Path(__file__).resolve().parent / '.env'
load_dotenv(env_path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from knowledge.models import KnowledgeBase
from knowledge.utils import generate_embedding, generate_query_embedding
import numpy as np
import time

def run_test():
    print("🧹 Cleaning up old test articles...")
    KnowledgeBase.objects.filter(title__startswith="Test:").delete()

    print("📝 Creating test articles...")
    articles = [
        ("Test: Fix VPN", "To fix your VPN connection, restart the Cisco AnyConnect client and check your certificate."),
        ("Test: Coffee Machine", "The coffee machine on generic floor 3 is broken. Please use the pantry on floor 2."),
        ("Test: Payroll Date", "Salaries are credited on the 28th of every month. Payslips are available on Workday.")
    ]

    for title, content in articles:
        print(f"   Generating embedding for: {title}...")
        emb = generate_embedding(content)
        if emb:
            kb = KnowledgeBase.objects.create(title=title, content=content, embedding=emb)
            kb.save()
        else:
            print(f"   ⚠️ Skipping {title} due to embedding failure.")
        time.sleep(10) # RATELIMIT BACKOFF (10s for free tier)

    print("\n🔍 Running Semantic Searches...")
    queries = [
        "cannot connect to office network",  # Should match VPN
        "where can i get coffee",            # Should match Coffee Machine
        "when do i get paid"                 # Should match Payroll
    ]

    for q in queries:
        print(f"\nQUERY: '{q}'")
        q_vec = generate_query_embedding(q)
        time.sleep(10) # RATELIMIT BACKOFF
        if not q_vec:
            print("❌ Failed to embed query")
            continue
            
        all_articles = KnowledgeBase.objects.filter(title__startswith="Test:")
        scores = []
        for a in all_articles:
            if not a.embedding: continue
            
            # cosine sim
            dp = np.dot(q_vec, a.embedding)
            nq = np.linalg.norm(q_vec)
            na = np.linalg.norm(a.embedding)
            sim = dp / (nq * na)
            scores.append((sim, a.title))
            
        scores.sort(key=lambda x: x[0], reverse=True)
        for score, title in scores:
            print(f"   {score:.4f} -> {title}")

if __name__ == "__main__":
    run_test()
