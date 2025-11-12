import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const InputSection = () => {
  const [mode, setMode] = useState<"recruiter" | "candidate">("recruiter");
  const [jdText, setJdText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleMatch = async () => {
    if (!jdText.trim() || !selectedFiles || selectedFiles.length === 0) {
      alert("Please fill the Job Description and choose at least one resume!");
      return;
    }

    setLoading(true);
    setResults([]);

    const formData = new FormData();
    formData.append("job_description", jdText);
    Array.from(selectedFiles).forEach((file) =>
      formData.append("resumes", file)
    );

    try {
      const response = await fetch("http://127.0.0.1:5000/match", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching match results:", error);
      alert("Something went wrong while matching. Try again!");
    } finally {
      setLoading(false);
    }
  };

  // Chart setup for Recruiter Mode
  const chartData = {
    labels: results.map((r) => r.candidate_name),
    datasets: [
      {
        label: "Combined Score",
        data: results.map((r) => r.combined_score),
        backgroundColor: "#00bcd4",
      },
    ],
  };

  return (
    <section id="input" className="py-20 text-center bg-darkbg">
      {/* 🧭 Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-glass p-2 rounded-full flex space-x-1">
          <button
            onClick={() => setMode("recruiter")}
            className={`px-4 py-2 rounded-full ${
              mode === "recruiter"
                ? "bg-accent text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🧑‍💼 Recruiter Mode
          </button>
          <button
            onClick={() => setMode("candidate")}
            className={`px-4 py-2 rounded-full ${
              mode === "candidate"
                ? "bg-accent text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            🙋‍♀️ Candidate Mode
          </button>
        </div>
      </div>

      <h2 className="text-3xl font-semibold mb-4">
        {mode === "recruiter" ? "Upload & Match" : "Get Resume Feedback"}
      </h2>
      <p className="text-gray-400 mb-10">
        {mode === "recruiter"
          ? "Paste your job description and resumes to get AI-powered match scores."
          : "Upload your resume and paste a job description to see how well you match — plus improvement tips!"}
      </p>

      {/* Input Area */}
      <div className="flex flex-wrap justify-center gap-10 mb-10">
        {mode === "recruiter" ? (
          <>
            <textarea
              placeholder="Paste Job Description here..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="bg-glass text-white p-4 rounded-xl w-96 h-52 backdrop-blur-md border border-gray-700 focus:border-accent outline-none transition"
            />

            <div className="bg-glass p-6 rounded-xl w-96 backdrop-blur-md border border-gray-700">
              <input
                id="resume-upload-input"
                type="file"
                multiple
                hidden
                onChange={handleFileChange}
              />
              <label
                htmlFor="resume-upload-input"
                className="cursor-pointer bg-accent text-white px-5 py-2 rounded-lg hover:shadow-[0_0_15px_#00bcd4] transition inline-block"
              >
                📤 Choose Resumes
              </label>

              <div
                id="file-list-display"
                className="mt-4 text-sm text-gray-300 text-left"
              >
                {selectedFiles && selectedFiles.length > 0 ? (
                  <ul className="list-disc pl-4 space-y-1">
                    {Array.from(selectedFiles).map((file, index) => (
                      <li key={index}>📄 {file.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic mt-2">
                    No files selected.
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-glass p-6 rounded-xl w-96 backdrop-blur-md border border-gray-700">
              <input
                id="resume-upload-candidate"
                type="file"
                hidden
                onChange={handleFileChange}
              />
              <label
                htmlFor="resume-upload-candidate"
                className="cursor-pointer bg-accent text-white px-5 py-2 rounded-lg hover:shadow-[0_0_15px_#00bcd4] transition inline-block"
              >
                📄 Upload Your Resume
              </label>
              <div
                id="file-list-display"
                className="mt-4 text-sm text-gray-300 text-left"
              >
                {selectedFiles && selectedFiles.length > 0 ? (
                  <ul className="list-disc pl-4 space-y-1">
                    {Array.from(selectedFiles).map((file, index) => (
                      <li key={index}>📄 {file.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic mt-2">
                    No resume selected.
                  </p>
                )}
              </div>
            </div>

            <textarea
              placeholder="Paste the Job Description you want to apply for..."
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="bg-glass text-white p-4 rounded-xl w-96 h-52 backdrop-blur-md border border-gray-700 focus:border-accent outline-none transition"
            />
          </>
        )}
      </div>

      {/* Match Button */}
      <div className="flex justify-center">
        <button
          onClick={handleMatch}
          disabled={loading}
          className={`${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-accent hover:shadow-[0_0_15px_#00bcd4]"
          } text-white px-8 py-3 rounded-xl font-medium transition`}
        >
          {loading
            ? "Analyzing..."
            : mode === "recruiter"
            ? "Match Now"
            : "Get Feedback"}
        </button>
      </div>

      {/* Results Section */}
      <div className="mt-16 text-left max-w-5xl mx-auto">
        {results.length > 0 ? (
          <>
            <h3 className="text-2xl font-semibold mb-6 text-center text-white">
              {mode === "recruiter" ? "Results" : "Your Resume Match"}
            </h3>

            {/* Recruiter Mode Results */}
            {mode === "recruiter" ? (
              <>
                <div className="bg-glass p-4 rounded-md mb-6">
                  <Bar data={chartData} />
                  <div className="text-sm text-gray-400 mt-2 text-center">
                    Score formula:{" "}
                    <strong>0.7 × semantic + 0.3 × keyword</strong>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {results.map((r, index) => {
                    const borderClass =
                      index === 0
                        ? "ring-2 ring-yellow-400"
                        : index === 1
                        ? "ring-2 ring-gray-300"
                        : index === 2
                        ? "ring-2 ring-amber-700"
                        : "border border-gray-700";

                    return (
                      <div
                        key={r.candidate_name}
                        className={`bg-glass p-6 rounded-xl ${borderClass} hover:shadow-[0_0_20px_#00bcd4] transition`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="text-xl text-accent font-semibold mb-2 flex items-center gap-2">
                            {index === 0 && (
                              <span className="text-yellow-400 text-2xl animate-pulse drop-shadow-[0_0_8px_#facc15]">
                                🥇
                              </span>
                            )}
                            {index === 1 && (
                              <span className="text-gray-300 text-2xl">🥈</span>
                            )}
                            {index === 2 && (
                              <span className="text-amber-700 text-2xl">🥉</span>
                            )}
                            {r.candidate_name}
                          </h4>

                          <div className="text-right">
                            <div className="text-gray-300 text-sm">Combined</div>
                            <div className="text-white font-bold text-lg">
                              {r.combined_score}%
                            </div>
                            <div className="text-sm text-gray-400">
                              ({r.semantic_score}% semantic)
                            </div>
                            <div className="text-sm text-gray-400">
                              ({r.keyword_score}% keyword)
                            </div>
                          </div>
                        </div>

                        <div className="mt-3">
                          <strong className="text-gray-300">
                            Matched Skills:
                          </strong>
                          <div className="text-sm text-green-300 mt-1">
                            {r.feedback.matched.length > 0
                              ? r.feedback.matched.join(", ")
                              : "—"}
                          </div>
                        </div>

                        <div className="mt-3">
                          <strong className="text-gray-300">
                            Missing Skills:
                          </strong>
                          <div className="text-sm text-yellow-300 mt-1">
                            {r.feedback.missing.length > 0
                              ? r.feedback.missing.join(", ")
                              : "None"}
                          </div>
                        </div>

                        <div className="mt-3">
                          <strong>Bias Audit:</strong>
                          <div
                            className={
                              r.bias_audit.status === "pass"
                                ? "text-green-400"
                                : "text-yellow-400"
                            }
                          >
                            {r.bias_audit.message}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              // 🧠 Candidate Mode Results
              <div className="bg-glass p-8 rounded-xl border border-gray-700 text-white">
                <h4 className="text-xl text-accent font-semibold mb-2">
                  Your Match Score:{" "}
                  <span className="text-white">{results[0].combined_score}%</span>
                </h4>
                <p className="text-gray-400 mb-4">
                  Semantic: {results[0].semantic_score}% | Keyword:{" "}
                  {results[0].keyword_score}%
                </p>

                <div className="mb-4">
                  <strong className="text-gray-300">Missing Skills:</strong>
                  <div className="text-sm text-yellow-300 mt-1">
                    {results[0].feedback.missing.length > 0
                      ? results[0].feedback.missing.join(", ")
                      : "None 🎯"}
                  </div>
                </div>

                <div className="mb-4">
                  <strong className="text-gray-300">Matched Skills:</strong>
                  <div className="text-sm text-green-300 mt-1">
                    {results[0].feedback.matched.length > 0
                      ? results[0].feedback.matched.join(", ")
                      : "—"}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg text-accent mb-2">Improvement Tips</h4>
                  {results[0].improvement_tips?.length > 0 ? (
                    <ul className="list-disc pl-5 text-gray-300 space-y-2">
                      {results[0].improvement_tips.map((tip: string, i: number) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">
                      Your resume aligns well with this JD. Great job! 🎯
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-400 mt-8">
            No results yet. Upload resumes to begin.
          </div>
        )}
      </div>
    </section>
  );
};

export default InputSection;
