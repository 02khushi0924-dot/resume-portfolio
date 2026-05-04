import io
from pdfminer.high_level import extract_text as pdf_extract
from docx import Document


def extract_text(raw_bytes: bytes, content_type: str) -> str:
    if content_type == "application/pdf":
        return _extract_pdf(raw_bytes)
    elif "wordprocessingml" in content_type:
        return _extract_docx(raw_bytes)
    raise ValueError("Unsupported file type")


def _extract_pdf(raw_bytes: bytes) -> str:
    buf = io.BytesIO(raw_bytes)
    text = pdf_extract(buf)
    return text or ""


def _extract_docx(raw_bytes: bytes) -> str:
    buf = io.BytesIO(raw_bytes)
    doc = Document(buf)
    lines = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n".join(lines)
