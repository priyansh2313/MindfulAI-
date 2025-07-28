import { Apple, Facebook, Lock, Mail } from 'lucide-react';
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import GoogleIcon from '../assets/images/google.svg'; // If you have a Google SVG, otherwise use a placeholder
import mentalBg from '../assets/images/login.jpg';
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
		<div className={styles.splitContainer}>
			<div className={styles.leftPane}>
				<div className={styles.logoBox}>Mindful AI</div>
				<div className={styles.formBox}>
					<h2 className={styles.subtitle}>Start your journey</h2>
					<h1 className={styles.mainTitle}>Login to Mindful AI</h1>
					{error && <p className={styles.error}>{error}</p>}
					<form onSubmit={handleSubmit} className={styles.form} autoComplete="off">
						<div className={styles.inputGroup}>
							<label className={styles.label}>E-mail</label>
							<div className={styles.inputIconWrapper}>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className={styles.input}
									placeholder="example@email.com"
									required
								/>
								<Mail className={styles.inputIcon} size={18} />
							</div>
						</div>
						<div className={styles.inputGroup}>
							<label className={styles.label}>Password</label>
							<div className={styles.inputIconWrapper}>
								<input
									type="password"
									value={password}
									placeholder="Password"
									onChange={(e) => setPassword(e.target.value)}
									className={styles.input}
									required
								/>
								<Lock className={styles.inputIcon} size={18} />
							</div>
						</div>
						<button type="submit" className={styles.button} disabled={loading}>
							{loading ? "Logging in..." : "Sign In"}
						</button>
					</form>
					<div className={styles.orDivider}><span>or sign in with</span></div>
					<div className={styles.socialRow}>
						<button className={styles.socialBtn}><Facebook size={20} /> </button>
						<button className={styles.socialBtn}><img src={GoogleIcon} alt="Google" height={20} /></button>
						<button className={styles.socialBtn}><Apple size={20} /></button>
					</div>
					
				</div>
			</div>
			<div className={styles.rightPane} style={{ backgroundImage: `url(${mentalBg})` }} />
		</div>
	);
};

export default Login;

