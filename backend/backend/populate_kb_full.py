# populate_kb_full.py
import os
import django

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from knowledge.models import KnowledgeBase

def populate():
    print("🚀 Starting Knowledge Base Population...")
    
    # Clear existing to avoid duplicates (Optional: comment out if needed)
    # KnowledgeBase.objects.all().delete() 

    articles = [
        # ===== AUTHENTICATION =====
        {
            "title": "How to Reset Your Password",
            "content": """To reset your password:
1. Go to the Login page.
2. Click on the 'Forgot Password?' link below the login form.
3. Enter your registered email address.
4. Check your email for a reset link.
5. Click the link and enter your new password twice to confirm.
If you do not receive the email within 5 minutes, checking your spam folder or contact IT support."""
        },
        {
            "title": "Account Locked or Disabled",
            "content": """If your account is locked due to multiple failed login attempts, wait 15 minutes and try again. 
If your account has been disabled by an administrator, you must contact the IT Helpdesk directly at extension 101 or email support@smartdesk.com."""
        },
        {
            "title": "How to Register a New Account",
            "content": """New employees can register for an account:
1. Visit the landing page.
2. Click 'Sign Up' in the top right corner.
3. Fill in your Name, Email, and choose a Password.
4. Select your Department (HR, IT, Sales, etc.).
5. Click 'Register'. You will be automatically logged in."""
        },

        # ===== TICKET MANAGEMENT =====
        {
            "title": "How to Create a Support Ticket",
            "content": """To report an issue:
1. Log in to your User Dashboard.
2. Click the 'Create New Ticket' button.
3. Enter a clear Subject (e.g., 'Printer on 2nd floor jammed').
4. Provide a detailed Description of the problem.
5. Click 'Submit Ticket'.
Our AI will automatically route your ticket to the correct department (IT, HR, Facilities) and assign a priority."""
        },
        {
            "title": "How to Check Ticket Status",
            "content": """You can view the status of your tickets on the User Dashboard.
- **Open**: The ticket is waiting for an agent.
- **In Progress**: An agent is working on your issue.
- **Pending**: The agent needs more information from you.
- **Resolved/Closed**: The issue is fixed.
Click on any ticket in the list to view its full history and comments."""
        },
        {
            "title": "Re-opening a Closed Ticket",
            "content": """If an issue persists after a ticket is closed:
1. Open the Chatbot or go to your Dashboard.
2. Find the closed ticket.
3. Open the ticket details.
4. Click the 'Re-open Ticket' button.
This will set the status back to 'Open' and notify the assigned agent."""
        },

        # ===== COMMON ISSUES =====
        {
            "title": "Laptop Performance Issues / Slow Computer",
            "content": """If your computer is running slow:
1. Restart your computer (this fixes typical memory leaks).
2. Close unused Chrome tabs and applications.
3. Check for Windows Updates (Settings > Update & Security).
4. If the issue continues, create a ticket with the subject 'Slow Performance' and include your asset tag number."""
        },
        {
            "title": "VPN Connection Errors",
            "content": """Common VPN fixes:
1. Ensure you have an active internet connection.
2. Restart the VPN client (Cisco AnyConnect / GlobalProtect).
3. Verify your password hasn't expired.
4. If you see 'Certificate Error', restart your laptop.
For persistent connection failures, log a ticket for the Network team."""
        },
        {
            "title": "Printer Not Working / Paper Jam",
            "content": """1. Check if the printer screen shows an error message.
2. If it says 'Paper Jam', follow the on-screen animation to remove the paper.
3. If it says 'Toner Low', create a ticket for Facilities.
4. If you cannot find the printer on your network, restart the print spooler or contact IT."""
        },
        {
            "title": "Payroll / Salary Discrepancies",
            "content": """For questions about your payslip or salary:
1. Check your pay slip in the HR Portal first.
2. If there is an error, create a ticket.
3. Our AI will route this directly to the HR Confidential queue.
Note: Salary tickets are strictly confidential and only visible to HR Managers."""
        },

        # ===== APP NAVIGATION =====
        {
            "title": "Where do I find my Profile Settings?",
            "content": """Click on your Avatar icon in the top right corner of the Dashboard to access Profile Settings. Here you can update your phone number, profile picture, and notification preferences."""
        },
        {
            "title": "Using the AI Chatbot",
            "content": """The Smart Assistant (Chatbot) is available on the landing page and your dashboard.
- Ask it questions like 'How do I reset my password?'.
- It can search the knowledge base for you.
- It can help you create a ticket if it doesn't know the answer."""
        },
    ]

    count = 0
    for data in articles:
        # Check if exists to prevent duplicates (rudimentary check)
        if not KnowledgeBase.objects.filter(title=data["title"]).exists():
            KnowledgeBase.objects.create(
                title=data["title"],
                content=data["content"],
                is_active=True
            )
            count += 1
            print(f"✅ Created article: {data['title']}")
        else:
            print(f"⏭️  Skipped (exists): {data['title']}")

    print(f"\n🎉 Done! Added {count} new articles to the Knowledge Base.")

if __name__ == '__main__':
    populate()
