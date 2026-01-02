import re
import os
import google.generativeai as genai
from django.db.models import Q
from knowledge.models import KnowledgeBase

def get_ai_chat_response(user_message, chat_history=[]):
    """
    Generates a conversational response using RAG + Google Gemini.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {
            "response": "I'm sorry, my brain connection is missing (API Key not found). I can't think right now!",
            "show_ticket_option": True
        }

    try:
        # 1. RAG: Search Knowledge Base for context
        from knowledge.utils import semantic_search
        context_docs = semantic_search(user_message, top_k=5)
        
        # Limit total context to top 5 most relevant-looking docs
        context_text = ""
        for doc in context_docs:
            context_text += f"---\nTitle: {doc.title}\nContent: {doc.content}\n---\n"

        # 2. Configure Gemini
        genai.configure(api_key=api_key)
        
        # Find model
        model_name = 'gemini-pro'
        try:
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods and 'gemini' in m.name:
                    model_name = m.name
                    break
        except: pass
        
        model = genai.GenerativeModel(model_name)

        # 3. Construct Prompt
        system_prompt = """
        You are 'SmartDesk', a helpful, professional, and friendly IT Service Desk AI.
        Your goal is to help employees resolve their issues using the provided KNOWLEDGE BASE articles.
        
        INSTRUCTIONS:
        1. Answer the user's question using ONLY the provided Context.
        2. If the Context contains the answer, explain it clearly step-by-step.
        3. If the Context DOES NOT contain the answer, politely say you don't have that information and suggest they create a ticket.
        4. Be concise but conversational. Do not mention "context" or "articles" directly, just give the info.
        5. If the user just says "hi" or "hello", greet them warmly and ask how to help.
        
        CONTEXT FROM KNOWLEDGE BASE:
        {context}
        """

        full_prompt = f"{system_prompt.replace('{context}', context_text)}\n\nUser Question: {user_message}"

        # 4. Generate
        response = model.generate_content(full_prompt)
        ai_text = response.text.strip()
        
        # 5. Determine if we should show "Create Ticket" button
        # If AI suggests creating a ticket or says it doesn't know, show the button.
        low_confidence_phrases = [
            "create a ticket", "submit a ticket", "don't have information", 
            "contact support", "don't know", "unable to help"
        ]
        
        show_ticket = any(phrase in ai_text.lower() for phrase in low_confidence_phrases)

        # If RAG found nothing and it wasn't a greeting, default to showing ticket option
        if not context_text and len(user_message.split()) > 2 and "hello" not in user_message.lower():
            show_ticket = True

        return {
            "response": ai_text,
            "show_ticket_option": show_ticket,
            "ticket_context": user_message # Pass original query for ticket creation
        }

    except Exception as e:
        print(f"❌ AI Chat Error: {e}")
        return {
            "response": "I'm having trouble connecting to the AI service right now. Please try again or create a ticket.",
            "show_ticket_option": True
        }
