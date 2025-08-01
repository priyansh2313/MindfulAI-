import { Apple, Brain, Facebook, Lock, Mail, Shield } from 'lucide-react';
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import GoogleIcon from '../assets/images/google.svg';
import axios from "../hooks/axios/axios";
import { setUser } from "../redux/slices/userSlice";
import styles from "../styles/Login.module.css";

interface CheckAuthResponse {
	user: {
	  _id: string;
	  email: string;
	  anonymousUsername: string;
	  // Add more fields as needed
	};
  }
  

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
	axios
	  .get<CheckAuthResponse>("/users/check")
	  .then((res) => {
		const user = res.data.user;
		console.log("✅ Already logged in:", user);
		localStorage.setItem("user", JSON.stringify(user));
		dispatch(setUser(user));
		navigate("/case-history");
	  })
	  .catch(() => {
		console.log("🔒 Not logged in");
	  });
  }, []);
  

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
    setError("");
    setLoading(true);
		axios
			.post<{ data: any }>("/users/login", { email, password }, {withCredentials: true})
			.then(({ data }) => {
				console.log(data.data);
				localStorage.setItem("user", JSON.stringify(data.data));
				dispatch(setUser(data.data));
				toast.success("Login successful!");
				navigate("/dashboard");
			})
			.catch((error: any) => {
        setError("Login failed!");
        toast.error("Login failed!");
        console.error(error);
      });
    setLoading(false);
	};

	return (
		<div className={styles.container}>
      {/* Floating Particles */}
      <div className={styles.particles}>
        {[...Array(9)].map((_, i) => (
          <div key={i} className={styles.particle}></div>
        ))}
      </div>

      <div className={styles.loginContainer}>
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
              <h2 className={styles.formTitle}>Welcome Back</h2>
              <p className={styles.formSubtitle}>🌟 Continue your mental wellness journey</p>
              <p className={styles.formDescription}>
                Sign in to access your personalized AI-powered mental wellness experience
              </p>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Email Address</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    placeholder="Enter your email"
                    required
                  />
                  <Mail className={styles.inputIcon} size={18} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Password</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="password"
                    value={password}
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    required
                  />
                  <Lock className={styles.inputIcon} size={18} />
                </div>
              </div>

              <button type="submit" className={styles.submitButton} disabled={loading}>
                {loading ? (
                  <div className={styles.loadingContent}>
                    <div className={styles.spinner}></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className={styles.buttonContent}>
                    <span>Sign In</span>
                    <Shield size={20} />
                  </div>
                )}
              </button>
            </form>

            <div className={styles.divider}>
              <span>or sign in with</span>
            </div>

            <div className={styles.socialButtons}>
              <button className={styles.socialButton}>
                <Facebook size={20} />
              </button>
              <button className={styles.socialButton}>
                <img src={GoogleIcon} alt="Google" height={20} />
              </button>
              <button className={styles.socialButton}>
                <Apple size={20} />
              </button>
            </div>

            <div className={styles.signupLink}>
              <span>Don't have an account? </span>
              <a href="/signup">Sign Up</a>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className={styles.rightPanel}>
          <div className={styles.rightContent}>
            <h2 className={styles.rightTitle}>Welcome to Mindful AI</h2>
            <p className={styles.rightDescription}>
              Continue your mental wellness journey with our cutting-edge AI technology and personalized care
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <Brain className={styles.featureIcon} />
                <span className={styles.featureText}>AI-Powered Insights</span>
              </div>
              <div className={styles.feature}>
                <Shield className={styles.featureIcon} />
                <span className={styles.featureText}>Secure & Private</span>
              </div>
              <div className={styles.feature}>
                <Mail className={styles.featureIcon} />
                <span className={styles.featureText}>Personalized Care</span>
              </div>
            </div>
          </div>
        </div>
      </div>
		</div>
	);
};

export default Login;

