import { Apple, Brain, Calendar, Facebook, Hash, Heart, Lock, Mail, Phone, Shield, User } from 'lucide-react';
import React, { useState } from "react";
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import axios from "../hooks/axios/axios";
import styles from "../styles/signup.module.css";

const Signup = () => {
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		email: "",
		password: "",
		dob: "",
    age: "",
	});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
		const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
	};

  const handleskip =()=>{
    navigate("/login");
  }

  const handleSubmit = async (e) => {
		e.preventDefault();
		if (formData.password !== confirmPassword) {
			setError("Passwords do not match!");
			return;
		}
    setError("");
		setLoading(true);

    // Convert age to number before sending
    const dataToSend = { ...formData, age: Number(formData.age) };

    try {
      const response = await axios.post("/users/register", dataToSend, { withCredentials: true });
      const user = response.data.data;
      localStorage.setItem("user", JSON.stringify(user));
      
      // Age-based navigation logic
      const userAge = Number(formData.age);
      if (userAge >= 55) {
        // Navigate to elder dashboard for users 55 and older
        navigate("/elder-dashboard");
      } else {
        // Navigate to normal dashboard for users under 55
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Signup failed! " + (err.response?.data?.error || ""));
    } finally {
		setLoading(false);
    }
	};

	return (
    <div className={styles.container}>
      {/* Floating Particles */}
      <div className={styles.particles}>
        {[...Array(9)].map((_, i) => (
          <div key={i} className={styles.particle}></div>
        ))}
      </div>

      <div className={styles.signupContainer}>
        {/* Left Panel - Form */}
        <div className={styles.leftPanel}>
          <div className={styles.formCard}>
            {/* Logo Section */}
            <div className={styles.logoSection}>
              <div className={styles.logoContainer}>
                <div className={styles.logoIcon}>
                  <Brain />
                </div>
                <div>
                  <h1 className={styles.logoText}>MINDFUL AI</h1>
                  <span className={styles.logoTagline}>Mental Wellness Revolution</span>
                </div>
              </div>
            </div>

            {/* Form Header */}
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Join the Revolution</h2>
              <p className={styles.formSubtitle}>🌟 Start your mental wellness journey</p>
              <p className={styles.formDescription}>
                Experience AI-powered insights and personalized care designed just for you
              </p>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Full Name*</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Enter your full name"
                    required
                  />
                  <User className={styles.inputIcon} size={18} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Email Address*</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Enter your email"
                    required
                  />
                  <Mail className={styles.inputIcon} size={18} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Phone Number*</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Enter your phone number"
                    required
                  />
                  <Phone className={styles.inputIcon} size={18} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Date of Birth*</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                  <Calendar className={styles.inputIcon} size={18} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Age*</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    className={styles.input}
                    placeholder="Enter your age"
                    required
                  />
                  <Hash className={styles.inputIcon} size={18} />
                </div>
                {formData.age && (
                  <div className={styles.ageInfo}>
                    {Number(formData.age) >= 55 ? (
                      <span className={styles.elderInfo}>👴 You'll be directed to the Elder Dashboard</span>
                    ) : (
                      <span className={styles.regularInfo}>👤 You'll be directed to the Regular Dashboard</span>
                    )}
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Password*</label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="Create a strong password"
                    required
                  />
                  <Lock className={styles.inputIcon} size={18} />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Confirm Password*</label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                    placeholder="Confirm your password"
                    required
                  />
                  <Lock className={styles.inputIcon} size={18} />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? (
                  <div className={styles.loadingContent}>
                    <div className={styles.spinner}></div>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  <div className={styles.buttonContent}>
                    <span>Create Account</span>
                    <Shield size={20} />
                  </div>
                )}
              </button>
            </form>

            <div className={styles.divider}>
              <span>or sign up with</span>
            </div>

            <div className={styles.socialButtons}>
              <button className={styles.socialButton}>
                <Facebook size={20} />
              </button>
              <button className={styles.socialButton}>
                <FaGoogle size={20} />
              </button>
              <button className={styles.socialButton}>
                <Apple size={20} />
              </button>
            </div>

            <div className={styles.loginLink}>
              <span>Already have an account? </span>
              <button onClick={handleskip}>Login</button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className={styles.rightPanel}>
          <div className={styles.rightContent}>
            <h2 className={styles.rightTitle}>Welcome to Mindful AI</h2>
            <p className={styles.rightDescription}>
              Join thousands of users who have transformed their mental wellness journey with our cutting-edge AI technology
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <Brain className={styles.featureIcon} />
                <span className={styles.featureText}>AI-Powered Insights</span>
              </div>
              <div className={styles.feature}>
                <Heart className={styles.featureIcon} />
                <span className={styles.featureText}>Personalized Care</span>
              </div>
              <div className={styles.feature}>
                <Shield className={styles.featureIcon} />
                <span className={styles.featureText}>Privacy First</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;