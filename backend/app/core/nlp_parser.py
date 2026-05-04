import re

def parse_resume(text: str) -> dict:
    """
    Parses resume text to extract basic information using regex.
    More complex extraction is handled by the AI generator.
    """
    data = {
        "name": "",
        "email": "",
        "phone": "",
        "summary": "",
        "skills": [],
        "experience": [],
        "education": [],
        "projects": [],
        "raw_text": text # Keep raw text for AI processing
    }

    # Extract Email
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    if email_match:
        data["email"] = email_match.group(0)

    # Extract Phone (Basic regex for various formats)
    phone_match = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    if phone_match:
        data["phone"] = phone_match.group(0)

    # Extract Name (Heuristic: look at first few lines, filter out common noise)
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    noise = ['resume', 'cv', 'curriculum vitae', 'profile', 'personal information']
    
    for line in lines[:5]:
        # Filter out emails, phones, and noise words
        if "@" in line or re.search(r'\d{5,}', line):
            continue
        if line.lower() in noise:
            continue
        if len(line) > 50 or len(line) < 3:
            continue
        
        data["name"] = line
        break

    return data
