import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
			<div className={styles.waveBg}>
				<svg viewBox="0 0 1440 320" width="100%" height="220" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 0 }}>
					<path fill="#aee1f9" fillOpacity="1">
						<animate attributeName="d" dur="12s" repeatCount="indefinite"
						values="M0,160L60,170C120,180,240,200,360,192C480,184,600,136,720,128C840,120,960,152,1080,170C1200,188,1320,180,1380,176L1440,172L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z;
M0,180L60,170C120,160,240,120,360,128C480,136,600,184,720,192C840,200,960,168,1080,150C1200,132,1320,140,1380,144L1440,148L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z;
M0,160L60,170C120,180,240,200,360,192C480,184,600,136,720,128C840,120,960,152,1080,170C1200,188,1320,180,1380,176L1440,172L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
					</path>
					<path fill="#fce4ec" fillOpacity="0.85">
						<animate attributeName="d" dur="16s" repeatCount="indefinite"
						values="M0,200L80,186.7C160,173,320,147,480,154.7C640,163,800,205,960,197.3C1120,189,1280,131,1360,102.7L1440,74.7L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z;
M0,160L80,170.7C160,181,320,211,480,202.7C640,195,800,149,960,154.7C1120,160,1280,218,1360,245.3L1440,272L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z;
M0,200L80,186.7C160,173,320,147,480,154.7C640,163,800,205,960,197.3C1120,189,1280,131,1360,102.7L1440,74.7L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z" />
					</path>
				</svg>
			</div>
			<div className={styles.card}>
				<div className={styles.illustration}>
					<svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
						<ellipse cx="36" cy="60" rx="18" ry="6" fill="#e0f7fa"/>
						<path d="M36 60C36 60 18 44 18 28C18 17.9543 26.9543 9 37 9C47.0457 9 56 17.9543 56 28C56 44 36 60 36 60Z" fill="#5ad5a8"/>
						<path d="M36 60C36 60 26 48 26 34C26 25.1634 32.1634 18 41 18" stroke="#7f8efc" strokeWidth="2.5" strokeLinecap="round"/>
					</svg>
				</div>
				<div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "1.5rem" }}>
					<h1 className={styles.title}>MINDFUL AI</h1>
				</div>

				{error && <p className={styles.error}>{error}</p>}

				<form onSubmit={handleSubmit} className={styles.form}>
					<label className={styles.label}>Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={styles.input}
						placeholder="email"
						required
					/>

					<label className={styles.label}>Password</label>
					<input
						type="password"
						value={password}
						placeholder="password"
						onChange={(e) => setPassword(e.target.value)}
						className={styles.input}
						required
					/>

					<button type="submit" className={styles.button} disabled={loading}>
						{loading ? "Logging in..." : "Login"}
					</button>
				</form>

				<div className={styles.linksRow}>
					<span>Don't have an account?</span>
					<Link to="/signup" className={styles.smallLink}>
						Sign up
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;

