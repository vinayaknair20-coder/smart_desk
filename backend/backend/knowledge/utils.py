import google.generativeai as genai
import os
from django.conf import settings
from django.db import models
from django.db.models import Q

import numpy as np
from .models import KnowledgeBase

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

def semantic_search(query, top_k=5):
    """
    Performs semantic search on KnowledgeBase articles using Cosine Similarity.
    """
    query_vec = generate_query_embedding(query)
    if not query_vec:
        # Fallback to simple database search
        return KnowledgeBase.objects.filter(is_active=True).filter(
            Q(title__icontains=query) | Q(content__icontains=query)
        )[:top_k]

    # Vector Search
    articles = KnowledgeBase.objects.filter(is_active=True).exclude(embedding__isnull=True)
    if not articles.exists():
        # Fallback to keyword search if no articles have embeddings
        return KnowledgeBase.objects.filter(is_active=True).filter(
            Q(title__icontains=query) | Q(content__icontains=query)
        )[:top_k]

    scored_results = []
    q_vec = np.array(query_vec)
    
    for article in articles:
        try:
            a_vec = np.array(article.embedding)
            if not a_vec.any(): continue # Skip empty/zero embeddings

            # Cosine Similarity: (A . B) / (||A|| * ||B||)
            dot_product = np.dot(q_vec, a_vec)
            norm_q = np.linalg.norm(q_vec)
            norm_a = np.linalg.norm(a_vec)
            
            similarity = dot_product / (norm_q * norm_a)
            scored_results.append((similarity, article))
        except:
            continue
            
    # Sort by similarity (highest first)
    scored_results.sort(key=lambda x: x[0], reverse=True)
    
    if not scored_results:
        # Final fallback if vector search yielded nothing
        return KnowledgeBase.objects.filter(is_active=True).filter(
            Q(title__icontains=query) | Q(content__icontains=query)
        )[:top_k]

    return [item[1] for item in scored_results[:top_k]]
