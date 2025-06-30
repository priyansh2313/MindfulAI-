import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../hooks/axios/axios";
import styles from "../styles/Profile.module.css"; // Using your new module CSS

const caseHistoryQuestions = [
  "1️⃣ Do you have any past medical conditions?",
  "2️⃣ Have you undergone any surgeries or hospitalizations?",
  "3️⃣ Have you been diagnosed with any chronic illnesses?",
  "4️⃣ Are you currently taking any medications? If yes, please specify.",
  "5️⃣ Do you have any known allergies? If yes, please specify.",
  "6️⃣ Have you ever experienced any significant head injuries?",
  "7️⃣ Do you have a family history of mental health issues?",
  "8️⃣ Have you ever been diagnosed with a mental health condition?",
  "9️⃣ Have you ever received therapy or counseling? If yes, was it helpful?",
  "🔟 How would you describe your sleep patterns (insomnia, oversleeping, normal)?",
  "1️⃣1️⃣ Do you consume alcohol, tobacco, or any other substances? If yes, how often?",
  "1️⃣2️⃣ Have you experienced any major life stressors recently (loss, trauma, etc.)?",
  "1️⃣3️⃣ Do you have a strong support system (friends, family, therapist)?",
];

export default function Profile() {
	const [profile, setProfile] = useState({});
  const [caseHistory, setCaseHistory] = useState({});
	const [loading, setLoading] = useState(true);
	const [saved, setSaved] = useState(false);
	const user = useSelector((state: any) => state.user.user);

	useEffect(() => {
		axios
			.get(`/users/profile/${user._id}`)
			.then(({ data }) => setProfile(data.data))
			.catch((err) => console.error(err))
      .finally(() => setLoading(false));
    
    axios.get('caseHistory', { withCredentials: true }).then(({ data }) => {
      setCaseHistory(data);
    }).catch((err) => console.error(err));
      
	}, [user]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setProfile((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async () => {
		try {
			setSaved(false);
			await axios.put(`/users/update/${user._id}`, { ...profile });
			setSaved(true);
			setTimeout(() => setSaved(false), 3000); // Hide success after 3 seconds
		} catch (error) {
			console.error(error);
		}
	};

	if (loading) {
		return (
			<div className={styles.loaderContainer}>
				<div className={styles.loader}></div>
			</div>
		);
	}

	return (
		<div className={styles.profilePage}>
			<div className={styles.profileContainer}>
				<h2 className={styles.profileTitle}>My Profile</h2>

				<input
					type="text"
					name="name"
					value={profile.name}
					onChange={handleChange}
					placeholder="Your Name"
					className={styles.inputField}
				/>
				<input
					type="phone"
					name="phone"
					value={profile.phone}
					onChange={handleChange}
					placeholder="Your Phone"
					className={styles.inputField}
				/>
				<input
					type="email"
					name="email"
					value={profile.email}
					onChange={handleChange}
					placeholder="Your Email"
					className={styles.inputField}
				/>

				<input
					type="date"
					name="dob"
					value={profile.dob.split("T")[0]}
					onChange={handleChange}
					className={styles.inputField}
				/>

				<input
					type="text"
					name="profession"
					value={profile.profession}
					onChange={handleChange}
					placeholder="Your Profession"
					className={styles.inputField}
				/>

				<textarea
					name="bio"
					value={profile.bio}
					onChange={handleChange}
					placeholder="Short Bio"
					className={`${styles.inputField} ${styles.textareaField}`}
				/>

				<button onClick={handleSubmit} className={styles.saveButton}>
					Save Changes
				</button>

				{saved && <div className={styles.successMessage}>🎉 Profile updated successfully!</div>}
      </div>
      <div className={styles.caseHistory}>
        <h2>Case History</h2>
        <p>Here you can view and edit your case history.</p>
        <div>
          <label>{caseHistoryQuestions[0]}</label>
          <textarea
            value={caseHistory.q1}
            placeholder="Your answer here..."
            className={styles.textareaField}
          />
          <label>{caseHistoryQuestions[1]}</label>
          <textarea
            value={caseHistory.q2}
            placeholder="Your answer here..."
            className={styles.textareaField}
          />
          <label>{caseHistoryQuestions[2]}</label>
          <textarea
            value={caseHistory.q3}
            placeholder="Your answer here..."
            className={styles.textareaField}
          />
          <label>{caseHistoryQuestions[3]}</label>
          <textarea
            value={caseHistory.q4}
            placeholder="Your answer here..."
            className={styles.textareaField}
          />
          <label>{caseHistoryQuestions[4]}</label>
          <textarea
            value={caseHistory.q5}
            placeholder="Your answer here..."
            className={styles.textareaField}
          />
          <label>{caseHistoryQuestions[5]}</label>
          <textarea
            value={caseHistory.q6}
            placeholder="Your answer here..."
            className={styles.textareaField}
          />
          <label>{caseHistoryQuestions[6]}</label>
          <textarea
            value={caseHistory.q7}
            placeholder="Your answer here..."
            className={styles.textareaField}
          />
          <label>{caseHistoryQuestions[7]}</label>
          <textarea
            value={caseHistory.q8}
            placeholder="Your answer here..."
            className={styles.textareaField}
          />
          <label>{caseHistoryQuestions[8]}</label>
          <textarea
            value={caseHistory.q9}
            placeholder="Your answer here..."
            className={styles.textareaField}
          />
          <label>{caseHistoryQuestions[9]}</label>
          <textarea
            value={caseHistory.q10}
            placeholder="Your answer here..."
            className={styles.textareaField}
          />
          <label>{caseHistoryQuestions[10]}</label>
          <textarea
            value={caseHistory.q11}
            placeholder="Your answer here..."
            className={styles.textareaField}
          />
          <label>{caseHistoryQuestions[11]}</label>
          <textarea
            value={caseHistory.q12}
            placeholder="Your answer here..."
            className={styles.textareaField}
          />
          <label>{caseHistoryQuestions[12]}</label>
          <textarea
            value={caseHistory.q13}
            placeholder="Your answer here..."
            className={styles.textareaField}
          />
        </div>
      </div>
		</div>
	);
}
