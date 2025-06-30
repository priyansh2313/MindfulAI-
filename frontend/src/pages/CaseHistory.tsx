import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "../hooks/axios/axios";
import styles from "./../styles/CaseHistory.module.css"; // ✅ Scoped CSS

const caseHistoryQuestions = [
  "⿡ Do you have any past medical conditions?",
  "⿢ Have you undergone any surgeries or hospitalizations?",
  "⿣ Have you been diagnosed with any chronic illnesses?",
  "⿤ Are you currently taking any medications? If yes, please specify.",
  "⿥ Do you have any known allergies? If yes, please specify.",
  "⿦ Have you ever experienced any significant head injuries?",
  "⿧ Do you have a family history of mental health issues?",
  "⿨ Have you ever been diagnosed with a mental health condition?",
  "⿩ Have you ever received therapy or counseling? If yes, was it helpful?",
  "🔟 How would you describe your sleep patterns (insomnia, oversleeping, normal)?",
  "⿡⿡ Do you consume alcohol, tobacco, or any other substances? If yes, how often?",
  "⿡⿢ Have you experienced any major life stressors recently (loss, trauma, etc.)?",
  "⿡⿣ Do you have a strong support system (friends, family, therapist)?",
];

const CaseHistory = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState(Array(caseHistoryQuestions.length).fill(""));

  const handleChange = (index: number, value: string) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleSubmit = () => {
    console.log("Submitted Case History:", responses);
    const toastId = toast.loading("Submitting case history...");
    const data = {
      q1: responses[0],
      q2: responses[1],
      q3: responses[2],
      q4: responses[3],
      q5: responses[4],
      q6: responses[5],
      q7: responses[6],
      q8: responses[7],
      q9: responses[8],
      q10: responses[9],
      q11: responses[10],
      q12: responses[11],
      q13: responses[12],
    }
    axios.post("/caseHistory", {
      data: data
    }, {withCredentials: true}).then(({ data }) => {
      toast.success("Case history submitted successfully!", { id: toastId });
      navigate("/dashboard");
    }).catch((error) => {
      toast.error("Error submitting case history. Please try again.", { id: toastId });
    })
  };

  return (
    <div className={styles.caseHistoryContainer}>
      <h1 className={styles.title}>📝 Case History Questions</h1>

      <div className={styles.questionsWrapper}>
        {caseHistoryQuestions.map((question, index) => (
          <div key={index} className={styles.questionBlock}>
            <p className={styles.question}>{question}</p>
            <textarea
              value={responses[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder="Your answer here..."
              className={styles.textInput}
            />
          </div>
        ))}
      </div>

      <button className={styles.submitBtn} onClick={handleSubmit}>
        Submit Case History
      </button>
    </div>
  );
};

export default CaseHistory;