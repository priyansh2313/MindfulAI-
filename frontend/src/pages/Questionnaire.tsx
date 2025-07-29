import emailjs from "emailjs-com";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from "../styles/Questionnaire.module.css";

const questions = [
  "Feeling nervous, anxious, or on edge?",
  "Not being able to stop or control worrying?",
  "Worrying too much about different things?",
  "Trouble relaxing?",
  "Being so restless that it is hard to sit still?",
  "Becoming easily annoyed or irritable?",
  "Feeling afraid as if something awful might happen?",
];

const options = [
  "Not at all",
  "Several days",
  "More than half the days",
  "Nearly every day",
];

const Questionnaire = () => {
  const [responses, setResponses] = useState<string[]>(Array(questions.length).fill("0"));
  const [step, setStep] = useState(0);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const navigate = useNavigate();

  const handleAnswer = (value: string) => {
    const next = [...responses];
    next[step] = value;
    setResponses(next);
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowEmailInput(true);
    }
  };

  const handleBack = () => {
    if (showEmailInput) return setShowEmailInput(false);
    if (step > 0) setStep(step - 1);
  };

  const handleSkip = () => {
    navigate("/login");
  };

  const handleStartTest = () => {
    setShowDisclaimer(false);
  };

  const handleSendReport = async () => {
    if (!email) {
      alert("Please enter a valid email address.");
      return;
    }

    const score = responses.reduce((acc, curr) => acc + parseInt(curr), 0);
    let result = "";
    if (score <= 4) result = "Minimal Anxiety";
    else if (score <= 9) result = "Mild Anxiety";
    else if (score <= 14) result = "Moderate Anxiety";
    else result = "Severe Anxiety";

    try {
      await emailjs.send(
        "service_6dchref",
        "template_h7uqq2m",
        {
          email,
          subject: "Your Mental Health Assessment Report",
          Response1: options[parseInt(responses[0])] || "N/A",
          Response2: options[parseInt(responses[1])] || "N/A",
          Response3: options[parseInt(responses[2])] || "N/A",
          Response4: options[parseInt(responses[3])] || "N/A",
          Response5: options[parseInt(responses[4])] || "N/A",
          Response6: options[parseInt(responses[5])] || "N/A",
          Response7: options[parseInt(responses[6])] || "N/A",
          TOTAL_SCORE: score,
          RESULT: result,
        },
        "AItht_OS3-C6_Q3nG"
      );

      alert("✅ Report sent successfully to " + email);
      setSubmitted(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send report. Try again.");
    }
  };

  // Show disclaimer for first-time users
  if (showDisclaimer) {
    return (
      <div className={styles.wizardContainer}>
        <div className={styles.card}>
          <div className={styles.disclaimer}>
            <h2 className={styles.disclaimerTitle}>Mental Health Assessment</h2>
            <div className={styles.disclaimerContent}>
              <p className={styles.disclaimerText}>
                <strong>First-time users:</strong> We recommend taking this assessment to get a personalized mental health evaluation.
              </p>
              <p className={styles.disclaimerText}>
                This questionnaire helps us understand your current mental state and provide tailored recommendations.
              </p>
              <div className={styles.disclaimerFeatures}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>📊</span>
                  <span>Detailed Assessment Report</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🎯</span>
                  <span>Personalized Recommendations</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🔒</span>
                  <span>Privacy Protected</span>
                </div>
              </div>
            </div>
            <div className={styles.disclaimerActions}>
              <button 
                onClick={handleSkip} 
                className={styles.skipBtn}
              >
                Skip to Login
              </button>
              <button 
                onClick={handleStartTest} 
                className={styles.startBtn}
              >
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the one‐question card, or the email stage, or the success message.
  return (
    <div className={styles.wizardContainer}>
      <div className={styles.card}>
        {!submitted ? (
          <>
            {/* Sticky Progress */}
            <div className={styles.progressHeader}>
              <span>
                {showEmailInput
                  ? "Review & Send"
                  : `Question ${step + 1} / ${questions.length}`}
              </span>
              {!showEmailInput && (
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                  />
                </div>
              )}
            </div>

            {!showEmailInput ? (
              <>
                {/* Question */}
                <h2 className={styles.question}>{questions[step]}</h2>

                {/* Options */}
                <div className={styles.options}>
                  {options.map((opt, i) => (
                    <button
                      key={i}
                      className={`${styles.optionBtn} ${
                        responses[step] === String(i) ? styles.selected : ""
                      }`}
                      onClick={() => handleAnswer(String(i))}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Email Input Stage */}
                <h2 className={styles.question}>Enter your email to receive the report</h2>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.emailInput}
                />
              </>
            )}

            {/* Navigation Buttons */}
            <div className={styles.nav}>
              <button
                onClick={handleBack}
                disabled={step === 0 && !showEmailInput}
                className={styles.backBtn}
              >
                Back
              </button>
              {!submitted && (
                <button
                  onClick={showEmailInput ? handleSendReport : handleNext}
                  className={styles.nextBtn}
                  disabled={!showEmailInput && responses[step] === "0"}
                >
                  {showEmailInput ? "Send Report" : step < questions.length - 1 ? "Next" : "Continue"}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className={styles.success}>
            <h2>✅ Report Sent Successfully!</h2>
            <p>Check your inbox at <strong>{email}</strong>.</p>
            <p>Redirecting to Dashboard…</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
