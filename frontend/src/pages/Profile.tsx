import {
  AlertCircle, Briefcase, Calendar, CheckCircle, FileText, Loader, Mail, Phone, Save, User
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../hooks/axios/axios";
import styles from "../styles/Profile.module.css";

const caseHistoryQuestions = [
  "Do you have any past medical conditions?",
  "Have you undergone any surgeries or hospitalizations?",
  "Have you been diagnosed with any chronic illnesses?",
  "Are you currently taking any medications? If yes, please specify.",
  "Do you have any known allergies? If yes, please specify.",
  "Have you ever experienced any significant head injuries?",
  "Do you have a family history of mental health issues?",
  "Have you ever been diagnosed with a mental health condition?",
  "Have you ever received therapy or counseling? If yes, was it helpful?",
  "How would you describe your sleep patterns (insomnia, oversleeping, normal)?",
  "Do you consume alcohol, tobacco, or any other substances? If yes, how often?",
  "Have you experienced any major life stressors recently (loss, trauma, etc.)?",
  "Do you have a strong support system (friends, family, therapist)?",
];

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const [caseHistory, setCaseHistory] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "caseHistory">("profile");
  const user = useSelector((state: any) => state.user.user);

  // --------- LOAD DATA ---------
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [{ data: profileRes }, { data: caseHistoryRes }] = await Promise.all([
          axios.get(`/users/profile/${user._id}`),
          axios.get(`/users/caseHistory/${user._id}`), // <-- Use unique endpoint per user if possible
        ]);
        setProfile(profileRes.data);
        setCaseHistory(caseHistoryRes.data || {});
      } catch (err) {
        setError("Failed to load profile or case history data");
      }
      setLoading(false);
    }
    fetchData();
    // eslint-disable-next-line
  }, [user]);

  // --------- HANDLE CHANGES ---------
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };
  const handleCaseHistoryChange = (index: number, value: string) => {
    setCaseHistory((prev: any) => ({
      ...prev,
      [`q${index + 1}`]: value,
    }));
  };

  // --------- SUBMIT HANDLER ---------
  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError("");
      // Save both profile and case history
      await Promise.all([
        axios.put(`/users/update/${user._id}`, profile),
        axios.put(`/users/updateCaseHistory/${user._id}`, caseHistory),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}>
          <Loader className={styles.loaderIcon} />
        </div>
        <p className={styles.loaderText}>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>My Profile</h1>
            <p className={styles.subtitle}>Manage your personal information and case history</p>
          </div>
          <div className={styles.headerActions}>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className={styles.saveButton}
            >
              {saving ? (
                <>
                  <Loader className={styles.buttonIcon} />
                  Saving...
                </>
              ) : (
                <>
                  <Save className={styles.buttonIcon} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {saved && (
          <div className={styles.successMessage}>
            <CheckCircle className={styles.messageIcon} />
            Profile updated successfully!
          </div>
        )}
        {error && (
          <div className={styles.errorMessage}>
            <AlertCircle className={styles.messageIcon} />
            {error}
          </div>
        )}

        {/* Tab Navigation */}
        <div className={styles.tabNavigation}>
          <button
            className={`${styles.tabButton} ${activeTab === "profile" ? styles.active : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User className={styles.tabIcon} />
            Personal Info
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "caseHistory" ? styles.active : ""}`}
            onClick={() => setActiveTab("caseHistory")}
          >
            <FileText className={styles.tabIcon} />
            Case History
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className={styles.tabContent}>
            <div className={styles.profileGrid}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <User className={styles.labelIcon} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name || ""}
                  onChange={handleProfileChange}
                  placeholder="Enter your full name"
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <Mail className={styles.labelIcon} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email || ""}
                  onChange={handleProfileChange}
                  placeholder="Enter your email"
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <Phone className={styles.labelIcon} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone || ""}
                  onChange={handleProfileChange}
                  placeholder="Enter your phone number"
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <Calendar className={styles.labelIcon} />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={profile.dob ? profile.dob.split("T")[0] : ""}
                  onChange={handleProfileChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>
                  <Briefcase className={styles.labelIcon} />
                  Profession
                </label>
                <input
                  type="text"
                  name="profession"
                  value={profile.profession || ""}
                  onChange={handleProfileChange}
                  placeholder="Enter your profession"
                  className={styles.input}
                />
              </div>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>
                  <FileText className={styles.labelIcon} />
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profile.bio || ""}
                  onChange={handleProfileChange}
                  placeholder="Tell us about yourself..."
                  className={`${styles.input} ${styles.textarea}`}
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        {/* Case History Tab */}
        {activeTab === "caseHistory" && (
          <div className={styles.tabContent}>
            <div className={styles.caseHistoryHeader}>
              <h3 className={styles.caseHistoryTitle}>Medical & Mental Health History</h3>
              <p className={styles.caseHistorySubtitle}>
                This information helps us provide better personalized care and recommendations.
              </p>
            </div>

            <div className={styles.caseHistoryGrid}>
              {caseHistoryQuestions.map((question, index) => (
                <div key={index} className={styles.questionGroup}>
                  <label className={styles.questionLabel}>
                    {index + 1}. {question}
                  </label>
                  <textarea
                    value={caseHistory[`q${index + 1}`] || ""}
                    placeholder="Your answer here..."
                    className={`${styles.input} ${styles.textarea}`}
                    rows={3}
                    onChange={(e) => handleCaseHistoryChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
