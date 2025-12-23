# tickets/ai_classifier.py - ENHANCED WITH SIMPLE NLP
import re

def classify_ticket(subject, description):
    """
    Uses NLP-enhanced keyword matching to classify tickets.
    NO API KEY REQUIRED - Perfect for demos!
    
    Args:
        subject (str): Ticket subject/title
        description (str): Ticket description
    
    Returns:
        dict: {"queue": int, "priority": int, "reasoning": str}
    """
    
    # Combine and normalize text
    text = f"{subject} {description}".lower()
    
    # Simple word stemming (remove common suffixes)
    def stem_text(text):
        # Remove punctuation
        text = re.sub(r'[^\w\s]', ' ', text)
        # Handle common word variations
        replacements = {
            'broken': 'break',
            'crashed': 'crash',
            'crashing': 'crash',
            'working': 'work',
            'printer': 'print',
            'printing': 'print',
            'locked': 'lock',
            'locking': 'lock',
            'freezing': 'freeze',
            'frozen': 'freeze',
            'heating': 'heat',
            'cooling': 'cool',
            'leaking': 'leak',
            'dripping': 'drip',
        }
        for word, stem in replacements.items():
            text = re.sub(r'\b' + word + r'\b', stem, text)
        return text
    
    text = stem_text(text)
    
    # Extract important phrases (multi-word matching)
    important_phrases = [
        'not working', 'stopped working', 'cant work', 'wont work',
        'laptop screen', 'computer screen', 'black screen', 'blue screen',
        'air conditioning', 'water leak', 'password reset', 'forgot password',
        'sick leave', 'vacation leave', 'email access', 'internet down',
        'wifi down', 'network down', 'system down', 'printer jam',
    ]
    
    phrase_matches = []
    for phrase in important_phrases:
        if phrase in text:
            phrase_matches.append(phrase)
    
    # Default values
    queue = 4  # Other
    priority = 2  # Medium
    reasoning = "Auto-classified based on keywords"
    
    # ===== QUEUE CLASSIFICATION WITH WEIGHTED SCORING =====
    
    # HR Keywords
    hr_keywords = [
        'payroll', 'salary', 'wage', 'pay', 'bonus', 'leave', 'vacation', 
        'holiday', 'sick', 'insurance', 'benefits', 'hire', 'recruit', 
        'onboard', 'resign', 'terminate', 'contract', 'employee', 'hr',
        'appraisal', 'performance', 'training', 'policy', 'harassment',
    ]
    
    # IT Keywords
    it_keywords = [
        'computer', 'laptop', 'desktop', 'screen', 'monitor', 'keyboard',
        'mouse', 'printer', 'software', 'hardware', 'windows', 'mac',
        'email', 'outlook', 'password', 'login', 'access', 'network',
        'internet', 'wifi', 'vpn', 'crash', 'freeze', 'error', 'bug',
        'install', 'update', 'virus', 'malware', 'server', 'database',
    ]
    
    # Facilities Keywords
    facilities_keywords = [
        'office', 'desk', 'chair', 'room', 'conference', 'meeting',
        'ac', 'air', 'conditioning', 'heat', 'light', 'bulb', 'water',
        'leak', 'plumb', 'toilet', 'bathroom', 'clean', 'maintenance',
        'repair', 'furniture', 'door', 'window', 'elevator', 'parking',
    ]
    
    # Weighted scoring (phrase matches count more)
    hr_score = sum(2 if keyword in phrase_matches else 1 
                   for keyword in hr_keywords if keyword in text)
    it_score = sum(2 if keyword in phrase_matches else 1 
                   for keyword in it_keywords if keyword in text)
    facilities_score = sum(2 if keyword in phrase_matches else 1 
                           for keyword in facilities_keywords if keyword in text)
    
    # Boost score for strong indicators
    if 'laptop' in text or 'computer' in text or 'screen' in text:
        it_score += 3
    if 'leave' in text or 'vacation' in text or 'payroll' in text:
        hr_score += 3
    if 'ac' in text or 'office' in text or 'room' in text:
        facilities_score += 2
    
    # Determine queue
    max_score = max(hr_score, it_score, facilities_score)
    
    if max_score >= 3:  # Minimum confidence threshold
        if hr_score == max_score:
            queue = 1
            reasoning = f"HR-related issue (confidence: {hr_score} points)"
        elif it_score == max_score:
            queue = 2
            reasoning = f"IT-related issue (confidence: {it_score} points)"
        elif facilities_score == max_score:
            queue = 3
            reasoning = f"Facilities-related issue (confidence: {facilities_score} points)"
    else:
        queue = 4
        reasoning = "General inquiry (low category confidence)"
    
    # ===== PRIORITY CLASSIFICATION =====
    
    # High Priority Indicators
    high_keywords = [
        'urgent', 'emergency', 'critical', 'asap', 'immediate',
        'down', 'break', 'crash', 'dead', 'block', 'stuck',
        'cannot', 'unable', 'wont', 'deadline', 'meeting',
    ]
    
    # Low Priority Indicators
    low_keywords = [
        'question', 'query', 'request', 'wondering', 'curious',
        'info', 'information', 'suggestion', 'whenever', 'later',
        'minor', 'small', 'optional', 'no rush',
    ]
    
    high_matches = sum(1 for keyword in high_keywords if keyword in text)
    low_matches = sum(1 for keyword in low_keywords if keyword in text)
    
    # Context-aware priority
    has_negation = any(word in text for word in ['not urgent', 'no rush', 'no hurry'])
    
    if has_negation:
        priority = 3
        reasoning += " | Low priority (user indicated non-urgent)"
    elif high_matches >= 2 or any(word in text for word in ['urgent', 'emergency', 'critical', 'down']):
        priority = 1
        reasoning += " | High priority (urgent keywords detected)"
    elif low_matches >= 2:
        priority = 3
        reasoning += " | Low priority (informational request)"
    else:
        priority = 2
        reasoning += " | Medium priority (standard request)"
    
    return {
        "queue": queue,
        "priority": priority,
        "reasoning": reasoning
    }
