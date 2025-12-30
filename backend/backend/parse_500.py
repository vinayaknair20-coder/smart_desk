import requests
from bs4 import BeautifulSoup
import sys

url = "http://127.0.0.1:8000/api/knowledge-base/"
print(f"Requesting {url}...")

try:
    response = requests.get(url)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 500:
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Django's debug 500 page has a title like 'TypeError at /api/knowledge-base/'
        title = soup.find('title')
        if title:
            print(f"\n--- Error Title ---\n{title.text.strip()}")
        
        # And a 'exception_value' section
        exception_val = soup.find('pre', class_='exception_value')
        if exception_val:
            print(f"\n--- Exception Value ---\n{exception_val.text.strip()}")
            
        # And the traceback summary
        summary = soup.find('div', id='summary')
        if summary:
            print(f"\n--- Summary ---\n{summary.text.strip()}")
            
        if not title and not exception_val:
            print("\n--- Raw HTML Snippet ---")
            print(response.text[:2000])
    else:
        print("Not a 500 error.")
except Exception as e:
    print(f"Test failed: {e}")
