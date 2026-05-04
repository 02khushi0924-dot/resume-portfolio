import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    print("WARNING: GEMINI_API_KEY not found in environment variables.")

def generate_portfolio(parsed_data: dict, theme: str = "Modern UI") -> dict:
    """
    Uses Gemini AI to refine resume data into a structured portfolio format.
    Following theme-specific strict instructions for extraction and formatting.
    """
    if not api_key:
        return _fallback_portfolio(parsed_data)

    # Switching to a 'Lite' model which often has higher or separate quota limits
    model = genai.GenerativeModel('models/gemini-flash-lite-latest')
    
    # Define theme-specific prompts with design tokens
    if theme == "Minimalist":
        style_instructions = """
        STYLE: Minimalist
        - Very clean, lots of white space
        - Simple typography
        - Neutral colors
        - No heavy visuals

        DESIGN REQUIREMENTS:
        - Font: simple sans-serif (e.g., Inter, Helvetica)
        - Background: white or very light gray
        - Primary color: black or dark gray
        - Accent color: subtle (light gray or muted blue)
        - Layout: single column, centered
        - Spacing: large padding and margins
        - Components: simple cards, no shadows or very light shadow

        MANDATORY CONTENT:
        - Full Name (must be clearly visible at top)
        - Contact Info (email, phone, LinkedIn, GitHub)
        - Short Professional Summary (2–3 lines max)
        - Skills (grouped neatly)
        - Projects (title + 2–3 bullet points each)
        - Experience (role + key responsibilities in bullets)
        - Education (short format: MUST show university/school name first, then degree)
        - Certifications (if present)

        RULES:
        - Do NOT skip any section
        - Do NOT add fake content or links (Only include GitHub/LinkedIn if present in resume)
        - Slightly improve wording but keep it simple
        - Prioritize readability over creativity

        OUTPUT FORMAT (JSON):
        {
          "design": {
            "theme": "minimalist",
            "font_family": "Inter, sans-serif",
            "background": "#ffffff",
            "text_color": "#111111",
            "accent_color": "#6b7280",
            "layout": "single-column",
            "card_style": "flat",
            "spacing": "wide"
          },
          "content": {
            "name": "",
            "contact": { "email": "", "phone": "", "linkedin": "", "github": "" },
            "summary": "",
            "skills": { "Technical": [], "Other": [] },
            "projects": [ { "title": "", "description": "", "technologies": [] } ],
            "experience": [ { "company": "", "role": "", "period": "", "description": "" } ],
            "education": [ { "institution": "", "degree": "", "year": "" } ]
          }
        }
        """
    elif theme == "Artistic":
        style_instructions = """
        STYLE: Artistic
        - Creative, visually expressive, but HIGHLY READABLE
        - Background: MUST be a light, soft gradient for visibility

        DESIGN REQUIREMENTS:
        - Font: stylish mixed fonts (e.g., Playfair Display, serif)
        - Background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)
        - Primary color: #5b21b6
        - Accent color: #be185d
        - Layout: grid-based

        RULES:
        - Do NOT add links like GitHub if not in resume
        - Use dark text (#1f2937) for the light background

        OUTPUT FORMAT (JSON):
        {
          "design": {
            "theme": "artistic",
            "font_family": "Playfair Display, serif",
            "background": "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
            "text_color": "#1f2937",
            "accent_color": "#5b21b6",
            "layout": "grid"
          },
          "content": {
            "name": "",
            "tagline": "",
            "about": "",
            "contact": { "email": "", "phone": "", "linkedin": "", "github": "" },
            "skills": { "Expertise": [], "Creative": [] },
            "projects": [ { "title": "", "description": "", "impact": "" } ],
            "experience": [ { "company": "", "role": "", "period": "", "description": "" } ],
            "education": []
          }
        }
        """
    else: # Modern UI
        style_instructions = """
        STYLE: Modern UI
        - Clean, stylish, tech-inspired
        - Background: Very distinct Dark/Light contrast

        DESIGN REQUIREMENTS:
        - Font: Poppins, Roboto
        - Background: #0f172a (Dark Mode)
        - Primary color: #38bdf8
        - Accent color: #22d3ee
        - Layout: multi-section

        RULES:
        - Do NOT add links like GitHub if not present in resume
        - Emphasize measurable impact

        OUTPUT FORMAT (JSON):
        {
          "design": {
            "theme": "modern",
            "font_family": "Poppins, sans-serif",
            "background": "#0f172a",
            "text_color": "#f8fafc",
            "accent_color": "#38bdf8",
            "layout": "multi-section"
          },
          "content": {
            "name": "",
            "title": "",
            "summary": "",
            "contact": { "email": "", "phone": "", "linkedin": "", "github": "" },
            "skills": { "languages": [], "tools": [] },
            "projects": [ { "title": "", "description": "", "outcomes": "" } ],
            "experience": [ { "company": "", "role": "", "period": "", "description": "" } ],
            "education": []
          }
        }
        """

    prompt = f"""
    You are an ELITE professional portfolio generator. Your task is to extract all details from the provided resume and transform them according to the specified style.

    {style_instructions}

    RESUME CONTENT (PARSED):
    {json.dumps(parsed_data, indent=2)}

    RESUME RAW TEXT (FOR CONTEXT):
    {parsed_data.get('raw_text', '')}

    IMPORTANT: Return ONLY the JSON object. No conversational text.
    """

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Log for debugging
        print(f"DEBUG: AI Response received (first 100 chars): {text[:100]}...")

        # Robust JSON extraction
        json_str = text
        if "```json" in text:
            json_str = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            json_str = text.split("```")[1].split("```")[0].strip()
        
        # Remove any leading/trailing non-JSON characters if splitting failed
        if not json_str.startswith('{'):
            start_idx = json_str.find('{')
            end_idx = json_str.rfind('}')
            if start_idx != -1 and end_idx != -1:
                json_str = json_str[start_idx:end_idx+1]
            
        ai_data = json.loads(json_str)
        
        # Fix for nested 'content' and 'design' keys if AI returned them correctly
        if "content" in ai_data:
            content = ai_data["content"]
            # Ensure name is present in content
            if not content.get("name") or content.get("name") == "Full Name":
                content["name"] = parsed_data.get("name") or "Professional Name"
            return ai_data
            
        # Fallback if AI didn't follow the design/content structure but returned flat JSON
        return {
            "design": {"theme": theme.lower()},
            "content": ai_data
        }
    except Exception as e:
        print(f"AI Generation failed: {e}")
        print(f"Raw response was: {text if 'text' in locals() else 'No response'}")
        return _fallback_portfolio(parsed_data)

def _fallback_portfolio(data: dict) -> dict:
    """Enhanced fallback with regex-based 'Safety Parser' to extract content when AI fails."""
    import re
    raw = data.get("raw_text", "")
    
    # Simple regex extraction for sections
    def get_section(name, text):
        pattern = rf"{name}[:\s\n]+(.*?)(?=\n[A-Z][a-z]+:|\Z)"
        match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        return match.group(1).strip() if match else ""

    skills_text = get_section("skills", raw)
    exp_text = get_section("experience|work history", raw)
    edu_text = get_section("education", raw)
    proj_text = get_section("projects", raw)

    return {
        "design": {
            "theme": "modern",
            "font_family": "Inter, sans-serif",
            "background": "#f8fafc",
            "text_color": "#1e293b",
            "accent_color": "#3b82f6"
        },
        "content": {
            "name": data.get("name", "Professional Name"),
            "contact": {
                "email": data.get("email", ""),
                "phone": data.get("phone", ""),
                "linkedin": "", "github": "", "portfolio": ""
            },
            "summary": "Portfolio generated from extracted data.",
            "skills": {"General": [s.strip() for s in skills_text.split(',')] if skills_text else []},
            "experience": [{"company": "Experience", "role": "Position", "period": "", "description": exp_text}] if exp_text else [],
            "education": [{"institution": edu_text, "degree": "", "year": ""}] if edu_text else [],
            "projects": [{"title": "Project", "description": proj_text}] if proj_text else [],
            "certifications": [],
            "achievements": [],
            "extra": []
        }
    }
