import google.generativeai as genai
import os
from django.conf import settings

def generate_embedding(text):
    """
    Generates a vector embedding for the given text using Google Gemini.
    Returns: list of floats or None if it fails.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("⚠️ No GEMINI_API_KEY found for embeddings.")
        return None

    try:
        genai.configure(api_key=api_key)
        
        # Use embedding-001 model
        result = genai.embed_content(
            model="models/embedding-001",
            content=text,
            task_type="retrieval_document",
            title="Knowledge Base Article" 
        )
        return result['embedding']
    except Exception as e:
        print(f"❌ Embedding Error: {e}")
        return None

def generate_query_embedding(text):
    """
    Generates embedding optimized for a search query.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key: return None
    
    try:
        genai.configure(api_key=api_key)
        result = genai.embed_content(
            model="models/embedding-001",
            content=text,
            task_type="retrieval_query"
        )
        return result['embedding']
    except Exception as e:
        print(f"❌ Query Embedding Error: {e}")
        return None
