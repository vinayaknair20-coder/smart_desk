# tickets/ai_classifier.py - UPGRADED TO GEMINI AI WITH FALLBACK
import os
import json
import re
import google.generativeai as genai
from django.conf import settings

def classify_ticket_rule_based(subject, description):
    """
    Fallback rule-based classifier.
    """
    
    # Normalize text
    text = f"{subject} {description}".lower()
    text = re.sub(r'[^\w\s]', ' ', text)  # Remove punctuation
    
    # ===== ENHANCED QUEUE CLASSIFICATION =====
    
    # HR Keywords - Weighted by importance
    hr_primary = ['payroll', 'salary', 'wage', 'leave', 'vacation', 'resignation', 
                  'benefits', 'insurance', 'onboarding', 'hiring']
    hr_secondary = ['employee', 'hr', 'holiday', 'pto', 'sick', 'attendance', 
                    'performance', 'appraisal', 'contract', 'policy']
    
    # IT Keywords - Weighted by importance
    it_primary = ['laptop', 'computer', 'desktop', 'windows', 'mac', 'software', 
                  'network', 'wifi', 'email', 'password', 'login', 'printer', 
                  'server', 'system', 'crash', 'boot', 'screen']
    it_secondary = ['keyboard', 'mouse', 'monitor', 'app', 'application', 'internet',
                    'vpn', 'update', 'install', 'error', 'bug', 'virus', 'slow',
                    'freeze', 'hang', 'outlook', 'teams', 'zoom']
    
    # Facilities Keywords - Weighted by importance
    fac_primary = ['toilet', 'bathroom', 'restroom', 'washroom', 'ac', 'air conditioning',
                   'plumbing', 'leak', 'water', 'sink', 'faucet', 'hvac', 'heating',
                   'elevator', 'door', 'lock', 'cleaning', 'maintenance']
    fac_secondary = ['office', 'desk', 'chair', 'furniture', 'room', 'conference',
                     'meeting room', 'kitchen', 'pantry', 'light', 'lighting',
                     'floor', 'ceiling', 'wall', 'building', 'parking']
    
    # Calculate weighted scores
    hr_score = (
        sum(3 for kw in hr_primary if kw in text) +
        sum(1 for kw in hr_secondary if kw in text)
    )
    
    it_score = (
        sum(3 for kw in it_primary if kw in text) +
        sum(1 for kw in it_secondary if kw in text)
    )
    
    fac_score = (
        sum(3 for kw in fac_primary if kw in text) +
        sum(1 for kw in fac_secondary if kw in text)
    )
    
    # Strong phrase detection (overrides scores)
    strong_phrases = {
        'HR': ['vacation request', 'sick leave', 'salary issue', 'payroll problem',
               'leave approval', 'resignation letter', 'offer letter'],
        'IT': ['laptop not working', 'computer crash', 'email down', 'password reset',
               'wifi down', 'internet down', 'printer jam', 'screen broken',
               'windows not booting', 'blue screen', 'system error'],
        'Facilities': ['toilet broken', 'sink broken', 'ac not working', 
                       'air conditioning broken', 'bathroom issue', 'water leak',
                       'door broken', 'lock broken', 'light not working']
    }
    
    # Check for strong phrases
    queue = 4  # Default to Other
    confidence = "low"
    
    for category, phrases in strong_phrases.items():
        for phrase in phrases:
            if phrase in text:
                if category == 'HR':
                    queue = 1
                elif category == 'IT':
                    queue = 2
                elif category == 'Facilities':
                    queue = 3
                confidence = "high (phrase match)"
                break
        if confidence == "high (phrase match)":
            break
    
    # If no strong phrase match, use scores
    if queue == 4:
        max_score = max(hr_score, it_score, fac_score)
        
        if max_score >= 3:  # Minimum confidence threshold
            if fac_score == max_score:
                queue = 3
                confidence = f"medium (facilities score: {fac_score})"
            elif it_score == max_score:
                queue = 2
                confidence = f"medium (IT score: {it_score})"
            elif hr_score == max_score:
                queue = 1
                confidence = f"medium (HR score: {hr_score})"
        else:
            queue = 4
            confidence = "low (no clear category)"
    
    # Map queue to label for reasoning
    queue_labels = {1: "HR", 2: "IT", 3: "Facilities", 4: "Other"}
    reasoning = f"{queue_labels[queue]} - {confidence}"
    
    # ===== ENHANCED PRIORITY CLASSIFICATION =====
    
    # High priority indicators
    high_urgent = ['urgent', 'emergency', 'critical', 'asap', 'immediate', 'now']
    high_blocking = ['down', 'not working', 'broken', 'crashed', 'dead', 'stopped',
                     'cant', 'cannot', 'unable', 'blocked', 'stuck']
    high_impact = ['meeting', 'presentation', 'client', 'deadline', 'today']
    high_safety = ['leak', 'flooding', 'fire', 'smoke', 'danger', 'unsafe']
    
    # Low priority indicators
    low_indicators = ['question', 'query', 'wondering', 'curious', 'info', 
                      'information', 'request', 'could you', 'can you',
                      'when convenient', 'no rush', 'whenever', 'minor']
    
    # Count matches
    high_count = (
        sum(2 for kw in high_urgent if kw in text) +
        sum(1 for kw in high_blocking if kw in text) +
        sum(1 for kw in high_impact if kw in text) +
        sum(3 for kw in high_safety if kw in text)  # Safety is critical
    )
    
    low_count = sum(1 for kw in low_indicators if kw in text)
    
    # Negation detection
    has_negation = any(phrase in text for phrase in ['not urgent', 'no rush', 'no hurry', 'low priority'])
    
    # Determine priority
    if has_negation:
        priority = 3
        reasoning += " | Low priority (user indicated)"
    elif high_count >= 3:
        priority = 1
        reasoning += " | High priority (critical/urgent)"
    elif any(kw in text for kw in high_urgent) or any(kw in text for kw in high_safety):
        priority = 1
        reasoning += " | High priority (urgent keywords)"
    elif low_count >= 2 and high_count == 0:
        priority = 3
        reasoning += " | Low priority (informational)"
    else:
        priority = 2
        reasoning += " | Medium priority (standard)"
    
    return {
        "queue": queue,
        "priority": priority,
        "reasoning": reasoning + " (Rules Fallback)"
    }

def classify_ticket(subject, description):
    """
    Main classifier entry point. 
    Tries Google Gemini first, falls back to rule-based system if it fails.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("⚠️ No GEMINI_API_KEY found. Using rule-based classifier.")
        return classify_ticket_rule_based(subject, description)

    try:
        genai.configure(api_key=api_key)
        
        # Dynamically find a usable model
        model_name = 'gemini-pro' # fallback
        try:
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods and 'gemini' in m.name:
                    model_name = m.name
                    break
        except:
            pass
            
        print(f"DEBUG: Using Gemini Model: {model_name}")
        model = genai.GenerativeModel(model_name)
        
        prompt = f"""
        You are an intelligent service desk assistant. Classify the following ticket into a Queue and a Priority.
        
        Queues:
        1 = HR (Payroll, benefits, hiring, leave, policy)
        2 = IT (Hardware, software, network, access, bugs)
        3 = Facilities (Plumbing, AC, cleaning, furniture, building)
        4 = Other (If it doesn't fit clearly)

        Priorities:
        1 = High (Urgent, blocking work, safety hazard, strict deadline)
        2 = Medium (Standard request, broken but not blocking entire work)
        3 = Low (Question, info request, minor cosmetic issue, "no rush")

        Ticket Subject: {subject}
        Ticket Description: {description}

        Respond STRICTLY in JSON format:
        {{
            "queue": <int>,
            "priority": <int>,
            "reasoning": "<short explanation>"
        }}
        """

        response = model.generate_content(prompt)
        content = response.text
        
        # Clean up code blocks if Gemini adds them
        if "```json" in content:
            content = content.replace("```json", "").replace("```", "")
        if "```" in content:
            content = content.replace("```", "")
            
        data = json.loads(content)
        
        # Validate keys
        if "queue" not in data or "priority" not in data:
            raise ValueError("Invalid JSON structure")
            
        print(f"🤖 Gemini Classification: Queue {data['queue']}, Priority {data['priority']}")
        return data

    except Exception as e:
        print(f"❌ Gemini Error: {e}")
        # print("Using rule-based fallback.")
        return classify_ticket_rule_based(subject, description)
