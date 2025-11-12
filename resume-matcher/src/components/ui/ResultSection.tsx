// ResultsSection.tsx
import React from "react";

interface Result {
  candidate_name: string;
  semantic_score: number;
  keyword_score: number;
  combined_score: number;
  feedback: {
    matched: string[];
    missing: string[];
  };
  bias_audit: {
    status: string;
    message: string;
  };
  improvement_tips?: string[];
}

interface Props {
  results: Result[];
  mode: "recruiter" | "candidate";
}

const ResultsSection: React.FC<Props> = ({ results, mode }) => {
  if (!results || results.length === 0) {
    return (
      <section id="results" className="py-20 text-center bg-darkbg">
        <h2 className="text-3xl font-semibold mb-6 text-white">Results</h2>
        <p className="text-gray-400">No results yet. Upload resumes to begin.</p>
      </section>
    );
  }

  return (
    <section id="results" className="py-16 bg-darkbg text-white">
      <h2 className="text-3xl font-semibold text-center mb-10">
        {mode === "recruiter" ? "Resume Match Results" : "Your Resume Insights"}
      </h2>

      {mode === "recruiter" ? (
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {results.map((r, index) => {
            const rankColors = [
              "ring-2 ring-yellow-400",
              "ring-2 ring-gray-300",
              "ring-2 ring-amber-700",
              "border border-gray-700",
            ];
            return (
              <div
                key={r.candidate_name}
                className={`bg-glass p-6 rounded-xl backdrop-blur-md hover:shadow-[0_0_20px_#00bcd4] transition ${rankColors[index] || rankColors[3]}`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xl font-semibold text-accent">
                    {r.candidate_name}
                  </h4>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Combined Score</p>
                    <p className="text-2xl font-bold text-white">
                      {r.combined_score}%
                    </p>
                  </div>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
                  <div
                    className="bg-accent h-3 rounded-full transition-all duration-700"
                    style={{ width: `${r.combined_score}%` }}
                  ></div>
                </div>

                <p className="text-sm text-gray-400 mb-4">
                  Semantic: {r.semantic_score}% | Keyword: {r.keyword_score}%
                </p>

                <div className="text-sm mb-3">
                  <strong className="text-gray-300">Matched Skills:</strong>{" "}
                  <span className="text-green-300">
                    {r.feedback.matched.length > 0
                      ? r.feedback.matched.join(", ")
                      : "—"}
                  </span>
                </div>
                <div className="text-sm mb-3">
                  <strong className="text-gray-300">Missing Skills:</strong>{" "}
                  <span className="text-yellow-300">
                    {r.feedback.missing.length > 0
                      ? r.feedback.missing.join(", ")
                      : "None 🎯"}
                  </span>
                </div>

                <div className="mt-3">
                  <strong className="text-gray-300">Bias Audit:</strong>{" "}
                  <span
                    className={
                      r.bias_audit.status === "pass"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }
                  >
                    {r.bias_audit.message}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-glass p-8 rounded-xl border border-gray-700 max-w-3xl mx-auto text-white">
          <h3 className="text-2xl font-semibold text-accent mb-2">
            Your Match Score: {results[0].combined_score}%
          </h3>
          <p className="text-gray-400 mb-4">
            Semantic: {results[0].semantic_score}% | Keyword:{" "}
            {results[0].keyword_score}%
          </p>

          <div className="mb-4">
            <strong className="text-gray-300">Missing Skills:</strong>{" "}
            <span className="text-yellow-300">
              {results[0].feedback.missing.length > 0
                ? results[0].feedback.missing.join(", ")
                : "None 🎯"}
            </span>
          </div>

          <div className="mb-4">
            <strong className="text-gray-300">Matched Skills:</strong>{" "}
            <span className="text-green-300">
              {results[0].feedback.matched.length > 0
                ? results[0].feedback.matched.join(", ")
                : "—"}
            </span>
          </div>

          {results[0].improvement_tips && (
            <div className="mt-6">
              <h4 className="text-lg text-accent mb-2">Improvement Tips</h4>
              <ul className="list-disc pl-5 text-gray-300 space-y-1">
                {results[0].improvement_tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ResultsSection;
