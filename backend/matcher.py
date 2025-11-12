# matcher.py (updated)
from sentence_transformers import SentenceTransformer, util
import fitz  # PyMuPDF
import spacy
import re

model = SentenceTransformer('all-MiniLM-L6-v2')
nlp = spacy.load("en_core_web_sm")

def extract_text_from_pdf(file_path):
    text = ""
    with fitz.open(file_path) as pdf:
        for page in pdf:
            text += page.get_text()
    return text

def calculate_similarity(jd_text, resume_text):
    jd_vector = model.encode(jd_text, convert_to_tensor=True)
    resume_vector = model.encode(resume_text, convert_to_tensor=True)
    score = util.pytorch_cos_sim(jd_vector, resume_vector).item()
    return round(score * 100, 2)  # percentage

def normalize_words(text):
    # simple tokenization + lowercase; adapt if you want more robust skill extraction
    words = re.findall(r"\b[a-zA-Z0-9+#\.\+-]+\b", text.lower())
    return set(words)

def get_feedback(jd_text, resume_text):
    """
    Return both matched and missing keywords between JD and resume.
    """
    jd_words = normalize_words(jd_text)
    resume_words = normalize_words(resume_text)

    # Basic extraction: keywords that likely represent skills/nouns
    # You can refine using spacy noun/proper-noun filtering later
    matched = sorted(list(jd_words & resume_words))
    missing = sorted(list(jd_words - resume_words))

    return {
        "matched": matched[:15],  # limit to 15 for UI
        "missing": missing[:15]
    }

def keyword_score(jd_text, resume_text):
    jd_words = normalize_words(jd_text)
    if not jd_words:
        return 0.0
    resume_words = normalize_words(resume_text)
    matched = jd_words & resume_words
    score = len(matched) / len(jd_words)
    return round(score * 100, 2)  # percentage

def audit_bias(resume_text):
    gender_words = ["he", "she", "him", "her", "mr.", "mrs.", "miss"]
    found = [w for w in gender_words if w in resume_text.lower()]
    if found:
        return {"status": "flagged", "message": f"Potential bias indicators: {', '.join(found)}"}
    return {"status": "pass", "message": "No bias indicators found"}
