import { Apple, Calendar, Facebook, Hash, Lock, Mail, Phone, User } from 'lucide-react';
import React, { useState } from "react";
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import mentalBg from '../assets/images/login.jpg';
import axios from "../hooks/axios/axios";
import styles from "../styles/Login.module.css";

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
      if (user.age > 60) {
        navigate("/elder-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Signup failed! " + (err.response?.data?.error || ""));
    } finally {
		setLoading(false);
    }
	};

	return (
  <div className={styles.splitContainer}>
    <div className={styles.leftPane}>
      <div className={styles.logoBox}>InsideBox</div>
      <div className={styles.formBox}>
        <h2 className={styles.subtitle}>Start your journey</h2>
        <h1 className={styles.mainTitle}>Sign Up to InsideBox</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form} autoComplete="off">
          <div className={styles.inputGroup}>
            <label className={styles.label}>Full Name*</label>
            <div className={styles.inputIconWrapper}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.input}
                required
              />
              <User className={styles.inputIcon} size={18} />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Address*</label>
            <div className={styles.inputIconWrapper}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
              />
              <Mail className={styles.inputIcon} size={18} />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Phone Number*</label>
            <div className={styles.inputIconWrapper}>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
                required
              />
              <Phone className={styles.inputIcon} size={18} />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Date of Birth*</label>
            <div className={styles.inputIconWrapper}>
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
            <label className={styles.label}>Age*</label>
            <div className={styles.inputIconWrapper}>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="1"
                className={styles.input}
                required
              />
              <Hash className={styles.inputIcon} size={18} />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Password*</label>
            <div className={styles.inputIconWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                required
              />
              <Lock className={styles.inputIcon} size={18} />
              <button
                type="button"
                className={styles.inputIcon}
                style={{ right: 36, background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Confirm Password*</label>
            <div className={styles.inputIconWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                required
              />
              <Lock className={styles.inputIcon} size={18} />
              <button
                type="button"
                className={styles.inputIcon}
                style={{ right: 36, background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <div className={styles.orDivider}><span>or sign up with</span></div>
        <div className={styles.socialRow}>
          <button className={styles.socialBtn}><Facebook size={20} /></button>
          <button className={styles.socialBtn}><FaGoogle size={20} /></button>
          <button className={styles.socialBtn}><Apple size={20} /></button>
        </div>
        <div className={styles.linksRow}>
          <span>Already have an account?</span>
          <a href="/login" className={styles.smallLink}>Login</a>
        </div>
      </div>
    </div>
    <div className={styles.rightPane} style={{ backgroundImage: `url(${mentalBg})` }} />
  </div>
);
};

export default Signup;