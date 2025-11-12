# app.py (final version)
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from matcher import extract_text_from_pdf, calculate_similarity, get_feedback, audit_bias, keyword_score

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/match", methods=["POST"])
def match_resumes():
    jd_text = request.form.get("job_description", "")
    files = request.files.getlist("resumes")

    results = []

    for file in files:
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)

        resume_text = extract_text_from_pdf(file_path)

        # --- Step 1: Compute Scores ---
        semantic_score = calculate_similarity(jd_text, resume_text)  # %
        key_score = keyword_score(jd_text, resume_text)  # %
        combined_score = round((0.7 * semantic_score) + (0.3 * key_score), 2)

        # --- Step 2: Generate Feedback and Bias Audit ---
        feedback = get_feedback(jd_text, resume_text)
        bias_audit = audit_bias(resume_text)

        # --- Step 3: Build Base Result Object ---
        result = {
            "candidate_name": file.filename,
            "semantic_score": semantic_score,
            "keyword_score": key_score,
            "combined_score": combined_score,
            "feedback": feedback,   # { "matched": [...], "missing": [...] }
            "bias_audit": bias_audit
        }

        # --- Step 4: Candidate Mode Improvement Tips ---
        # If the user uploaded just ONE resume, treat this as Candidate Mode
        if len(files) == 1:
            tips = []

            # Tip 1: Add missing keywords
            if feedback.get("missing"):
                missing_keywords = feedback["missing"][:5]  # show top 5 only
                tips.append(f"Consider adding keywords like: {', '.join(missing_keywords)}.")

            # Tip 2: Based on score
            if combined_score < 60:
                tips.append(
                    "Try adding measurable achievements and project details to make your resume more impactful."
                )
            elif 60 <= combined_score < 80:
                tips.append(
                    "You're close! Emphasize relevant tools or technologies mentioned in the job description."
                )
            else:
                tips.append(
                    "Excellent match! Just ensure formatting and clarity for submission."
                )

            # Tip 3: If bias risk detected
            if bias_audit.get("status") == "flagged":
                tips.append(
                    "Consider removing personal identifiers like names, gendered words, or school names to reduce bias."
                )

            # Add tips to result
            result["improvement_tips"] = tips

        results.append(result)

    # --- Step 5: Sort (only relevant for recruiter mode) ---
    results.sort(key=lambda x: x["combined_score"], reverse=True)

    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)
