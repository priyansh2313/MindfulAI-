import Lottie from "lottie-react";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiMic } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import TalkingPsychologist from "../assets/talkingPsychologist.json";
import FeedbackComponent, { isMood } from "../components/FeedbackComponent";
import axios from "../hooks/axios/axios";
import FloatingChatbot from "../pages/FloatingChatbot";
import styles from "../styles/Evaluation.module.css";
import { logFeedback } from "../utils/reinforcement";

// Fix TypeScript error for SpeechRecognition
declare global {
	interface Window {
		webkitSpeechRecognition: any;
		SpeechRecognition: any;
	}
}

const categories = {
	anxiety: [
		{ q: "Feeling nervous, anxious, or on edge", scale: 3 },
		{ q: "Not being able to stop or control worrying", scale: 3 },
		{ q: "Worrying too much about different things", scale: 3 },
		{ q: "Trouble relaxing", scale: 3 },
		{ q: "Being so restless that it is hard to sit still", scale: 3 },
		{ q: "Becoming easily annoyed or irritable", scale: 3 },
		{ q: "Feeling afraid, as if something awful might happen", scale: 3 },
	],
	depression: [
		{ q: "Little interest or pleasure in doing things", scale: 3 },
		{ q: "Feeling down, depressed, or hopeless", scale: 3 },
		{ q: "Trouble falling or staying asleep, or sleeping too much", scale: 3 },
		{ q: "Feeling tired or having little energy", scale: 3 },
		{ q: "Poor appetite or overeating", scale: 3 },
		{ q: "Feeling bad about yourself or that you are a failure", scale: 3 },
		{ q: "Trouble concentrating on things", scale: 3 },
		{ q: "Moving or speaking slowly or restlessly", scale: 3 },
		{ q: "Thoughts that you would be better off dead", scale: 3 },
	],
	insomnia: [
		{ q: "Difficulty falling asleep", scale: 4 },
		{ q: "Difficulty staying asleep", scale: 4 },
		{ q: "Problems waking up too early", scale: 4 },
		{ q: "Satisfaction with current sleep pattern", scale: 4, reverse: true },
		{ q: "Sleep interference with daily functioning", scale: 4 },
		{ q: "Noticeability of sleep problems by others", scale: 4 },
		{ q: "Worry/distress about sleep difficulties", scale: 4 },
	],
	stress: [
		{ q: "Felt upset by unexpected events", scale: 4 },
		{ q: "Felt unable to control important things in life", scale: 4 },
		{ q: "Felt nervous or stressed", scale: 4 },
		{ q: "Felt confident about handling problems", scale: 4, reverse: true },
		{ q: "Felt that things were going your way", scale: 4, reverse: true },
		{ q: "Felt that difficulties were piling up too high", scale: 4 },
	],
	selfEsteem: [
		{ q: "I am satisfied with myself", scale: 3 },
		{ q: "I think I am no good at all", scale: 3, reverse: true },
		{ q: "I have a number of good qualities", scale: 3 },
		{ q: "I am as capable as others", scale: 3 },
		{ q: "I do not have much to be proud of", scale: 3, reverse: true },
		{ q: "I feel useless at times", scale: 3, reverse: true },
		{ q: "I feel I am a person of worth", scale: 3 },
		{ q: "I wish I had more respect for myself", scale: 3, reverse: true },
		{ q: "I feel I am a failure", scale: 3, reverse: true },
		{ q: "I take a positive attitude toward myself", scale: 3 },
	],
};

const optionLabels = ["Never", "Rarely", "Sometimes", "Often", "Always"];
// const bengaliLabels = ["কখনো না", "কদাচিৎ", "মাঝেমধ্যে", "প্রায়ই", "সদা"];

const speakQuestion = (question: string) => {
  const synth = window.speechSynthesis;

  // Detect if the page is in Bengali
  const isBengali = document.documentElement.lang === "bn" ||
                    document.querySelector('html')?.getAttribute('lang')?.startsWith('bn');

  // Create a speech utterance
  const utterance = new SpeechSynthesisUtterance(question);

  if (isBengali) {
    utterance.lang = "bn-IN"; // Bengali (India) or "bn-BD" for Bengali (Bangladesh)
    const bengaliVoice = synth.getVoices().find(v => v.lang.startsWith("bn"));
    if (bengaliVoice) {
      utterance.voice = bengaliVoice;
    } else {
      console.warn("No Bengali voice found. Falling back to default voice.");
    }
  } else {
    utterance.lang = "en-US"; // English (US)
    utterance.voice = synth.getVoices().find(v => v.lang === "en-US") || null;
  }

  synth.cancel(); // Cancel any ongoing speech
  synth.speak(utterance);
};


const Evaluation = () => {
	const navigate = useNavigate();
	const [started, setStarted] = useState(false);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [answers, setAnswers] = useState<number[]>([]);
	const [showResults, setShowResults] = useState(false);
	const [chatbotOpen, setChatbotOpen] = useState(false);
	const [cameFromRL, setCameFromRL] = useState(false);
	const [feedbackGiven, setFeedbackGiven] = useState(false);
	const [listening, setListening] = useState(false);
	const [typedQuestion, setTypedQuestion] = useState("");
	const isTypingRef = useRef(false); // 🧠 track if mid-typing

	const recognitionRef = useRef<any>(null);
	const questions = useMemo(
		() =>
			Object.entries(categories).flatMap(([category, items]) =>
				items.map((item) => ({
					category,
					question: item.q,
					scale: item.scale,
					reverse: item.reverse || false,
				}))
			),
		[categories]
  );
  
  useEffect(() => {
  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    console.log("Available voices:", voices);
  };

  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  } else {
    setTimeout(loadVoices, 500);
  }
}, []);

	useEffect(() => {
		const source = localStorage.getItem("rl_action_source");
		if (source === "evaluation") setCameFromRL(true);
	}, []);

	const intervalRef = useRef<number | null>(null);

	useEffect(() => {
		if (!started || showResults) return;

		const currentQ = questions[currentQuestionIndex];
		if (!currentQ) return;

		const fullText = currentQ.question;
		let index = 0;
		let output = "";

		isTypingRef.current = true;
		setTypedQuestion(""); // visible text

		// Clear any existing typing loops
		if (intervalRef.current) {
			clearTimeout(intervalRef.current);
			intervalRef.current = null;
		}

		const typeNextChar = () => {
			if (index < fullText.length && isTypingRef.current) {
				output += fullText.charAt(index);
				setTypedQuestion(output); // update visible text
				index++;

				intervalRef.current = setTimeout(typeNextChar, 40);
			} else {
				isTypingRef.current = false;

				// ✅ Only speak when fully typed
				// const synth = window.speechSynthesis;
				// synth.cancel();
        // synth.speak(new SpeechSynthesisUtterance(fullText));
        speakQuestion(fullText); // Speak the question
			}
		};

		typeNextChar(); // start loop

		return () => {
			isTypingRef.current = false;
			clearTimeout(intervalRef.current!);
			intervalRef.current = null;
			setTypedQuestion(""); // clean reset
		};
	}, [currentQuestionIndex, started, showResults]);

	const handleOptionSelect = (value: number) => {
		const { reverse, scale } = questions[currentQuestionIndex];
		const score = reverse ? scale - value : value;
		const updatedAnswers = [...answers, score];
		setAnswers(updatedAnswers);

		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			const score = updatedAnswers.reduce((a, b) => a + b, 0);
			handleUpload(score);
			localStorage.setItem("evaluationScore", score.toString());
			setShowResults(true);
		}
	};

	const toggleVoiceInput = () => {
		const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

		if (!SpeechRecognition) {
			alert("Voice not supported.");
			return;
		}

		const recognition = new SpeechRecognition();
		const isBengali =
			document.documentElement.lang === "bn" || document.querySelector("html")?.getAttribute("lang")?.startsWith("bn");

		recognition.lang = isBengali ? "bn-IN" : "en-US";
		recognition.continuous = false;
		recognition.interimResults = false;

		recognition.onresult = (event: any) => {
			const transcript = event.results[0][0].transcript.toLowerCase();
			const bengaliLabels = ["কোখোনই না", "কদাচিৎ", "মাঝে মাঝে", "প্রায়শই", "সর্বদা"];
			let index = optionLabels.findIndex((label) => transcript.includes(label.toLowerCase()));

			if (index === -1 && isBengali) {
				index = bengaliLabels.findIndex((label) => transcript.includes(label));
			}

			if (index !== -1) handleOptionSelect(index);
		};

		recognition.onend = () => setListening(false);

		try {
			recognition.start();
			setListening(true);
			recognitionRef.current = recognition;
		} catch (err: any) {
			console.warn("Speech recognition error:", err.message);
		}
	};

	const getCategoryScores = () => {
		const scores: Record<string, number> = {};
		let index = 0;
		for (const key in categories) {
			const count = categories[key].length;
			scores[key] = answers.slice(index, index + count).reduce((a, b) => a + b, 0);
			index += count;
		}
		return scores;
	};

	const interpretCategory = (score: number, max: number) => {
		const pct = (score / max) * 100;
		if (pct <= 25) return "Low";
		if (pct <= 50) return "Moderate";
		if (pct <= 75) return "High";
		return "Severe";
	};

	const currentMood = localStorage.getItem("todayMood") || "😐";

	const handleUpload = (score: number) => {
		const scores: { [key: string]: number } = {};
		let index = 0;

		for (const key in categories) {
			const qCount = categories[key].length;
			scores[key] = answers.slice(index, index + qCount).reduce((a, b) => a + b, 0);
			index += qCount;
		}

		axios
			.post("/test", { ...scores, score }, { withCredentials: true })
			.then(({ data }) => {
				toast.success("Test Results Updated");
			})
			.catch((error) => {
				console.error("Error uploading data:", error);
			});
	};

	return (
		<div className={styles.evaluationContainer}>
			<FloatingChatbot
				isOpen={chatbotOpen}
				onToggle={() => setChatbotOpen(!chatbotOpen)}
				mode="evaluation"
				hoveredSection={null}
			/>

			{showResults ? (
				<div className={`${styles.resultText} ${styles.reportBackground}`}>
					<div className={styles.resultContainer}>
						<div className={styles.reportCard}>
							<h2 className={styles.reportTitle}>🧠 Mental Health Evaluation Report</h2>

							<p className={styles.reportMeta}>
								📅 {new Date().toLocaleDateString()} &nbsp;|&nbsp; 😐 Mood: {currentMood}
							</p>

							<table className={styles.reportTable}>
								<thead>
									<tr>
										<th>Category</th>
										<th>Score</th>
										<th>Severity</th>
									</tr>
								</thead>
								<tbody>
									{Object.entries(getCategoryScores()).map(([key, score]) => {
										const max = categories[key].length * categories[key][0].scale;
										const status = interpretCategory(score, max);
										return (
											<tr key={key}>
												<td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
												<td>
													{score} / {max}
												</td>
												<td
													className={
														status === "Severe"
															? styles.statusSevere
															: status === "High"
															? styles.statusHigh
															: status === "Moderate"
															? styles.statusModerate
															: styles.statusLow
													}>
													{status}
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>

							{/* Conditional Tips */}
							<div className={styles.tipSection}>
								{Object.entries(getCategoryScores()).map(([key, score]) => {
									const max = categories[key].length * categories[key][0].scale;
									const status = interpretCategory(score, max);
									if (status !== "Severe") return null;
									return (
										<div key={key} className={styles.tipCard}>
											⚠️ <strong>{key.toUpperCase()}</strong>: Please consider talking to a mental health
											professional or reaching out to someone you trust.
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			) : started ? (
				<>
					<p className={styles.scaleInfo}>📋 Based on GAD-7, PHQ-9, ISI, PSS, and RSES scales.</p>
					<div className={styles.questionRow}>
						<div className={styles.lottieBox}>
							<Lottie animationData={TalkingPsychologist} loop autoplay style={{ height: 140 }} />
						</div>
              <h3 className={styles.questionText} id='question'>{typedQuestion}</h3>
					</div>
					<p className={styles.progressText}>
						Question {currentQuestionIndex + 1} of {questions.length}
					</p>
					<div className={styles.optionsContainer}>
						{[...Array(questions[currentQuestionIndex].scale + 1).keys()].map((i) => (
							<button key={i} onClick={() => handleOptionSelect(i)} className={styles.optionButton}>
								{optionLabels[i] || `Option ${i}`}
							</button>
						))}
					</div>
					<p className={styles.voicePrompt}>🎤 Tap the mic and say your answer: "Never", "Often" etc.</p>
					<div className={listening ? styles.micGlow : ""}>
						<button
							className={styles.voiceButton}
							onClick={toggleVoiceInput}
							data-tooltip-id="micTip"
							data-tooltip-content="Say: Never, Often, etc.">
							<FiMic size={24} />
						</button>
						<Tooltip id="micTip" place="top" />

						{listening && <p className={styles.listeningText}>🎧 Listening...</p>}
					</div>
				</>
			) : (
				<>
					<button onClick={() => navigate("/dashboard")} className={styles.backButton}>
						<ArrowLeft className="inline h-5 w-5 mr-2" /> Back to Dashboard
					</button>
					{cameFromRL && isMood(currentMood) && <FeedbackComponent mood={currentMood} action="evaluation" />}
					<h2 className={styles.evaluationTitle}>Mental Health Evaluation</h2>
					<p className={styles.description}>
						This test includes questions from clinically validated scales. Be honest to get accurate insights.
					</p>
					<button onClick={() => setStarted(true)} className={styles.startButton}>
						Start Evaluation
					</button>
				</>
			)}

			{!feedbackGiven && (
				<div className={styles.feedbackFloat}>
					<span>Was this helpful?</span>
					<button
						onClick={() => {
							logFeedback(currentMood, "evaluation", 1);
							setFeedbackGiven(true);
						}}>
						Yes
					</button>
					<button
						onClick={() => {
							logFeedback(currentMood, "evaluation", 0);
							setFeedbackGiven(true);
						}}>
						No
					</button>
				</div>
			)}
		</div>
	);
};

export default Evaluation;
