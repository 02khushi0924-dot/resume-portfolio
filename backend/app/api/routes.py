from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.core.extractor import extract_text
from app.core.nlp_parser import parse_resume
from app.core.ai_generator import generate_portfolio

router = APIRouter()

ALLOWED = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

@router.post("/parse-resume")
async def parse_resume_endpoint(file: UploadFile = File(...), theme: str = Form("Modern UI")):
    if file.content_type not in ALLOWED:
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")

    raw_bytes = await file.read()
    if len(raw_bytes) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File must be under 5 MB.")

    try:
        text = extract_text(raw_bytes, file.content_type)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not extract text: {e}")

    if not text or len(text.strip()) < 50:
        raise HTTPException(status_code=422, detail="Resume appears to be empty or unreadable.")

    parsed = parse_resume(text)

    try:
        portfolio = generate_portfolio(parsed, theme=theme)
    except Exception:
        # AI failed — still return parsed data with defaults
        portfolio = parsed
        portfolio.setdefault("bio", parsed.get("summary", ""))
        portfolio.setdefault("tagline", "Software Professional")

    return portfolio
