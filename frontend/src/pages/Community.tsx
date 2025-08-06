"use client";

import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import styles from "../styles/community.module.css";
declare module "emoji-picker-react";

// Socket.IO will be imported dynamically
let socket: any = null;

const colors = ["#F06292", "#64B5F6", "#81C784", "#FFD54F", "#BA68C8"];

// Interest options for users to select
const interestOptions = [
	{ id: "anxiety", label: "Anxiety Support", emoji: "😰" },
	{ id: "depression", label: "Depression", emoji: "😔" },
	{ id: "stress", label: "Stress Management", emoji: "😤" },
	{ id: "mindfulness", label: "Mindfulness", emoji: "🧘" },
	{ id: "meditation", label: "Meditation", emoji: "🕉️" },
	{ id: "wellness", label: "Wellness Tips", emoji: "💚" },
	{ id: "motivation", label: "Motivation", emoji: "💪" },
	{ id: "gratitude", label: "Gratitude", emoji: "🙏" },
];

export default function CommunityChat() {
	const user = useSelector((state: any) => state.user.user);
	console.log(user);
	const [username, setUsername] = useState(user.anonymousUsername);
	const [loginName, setLoginName] = useState(""); // live input for name
	const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
	const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<
		{ id: string; username: string; message: string; fileUrl?: string; profilePicUrl?: string; timestamp?: string }[]
	>([]);
	const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
	const [typingUser, setTypingUser] = useState<string | null>(null);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [currentRoom, setCurrentRoom] = useState("general");
	const [isConnected, setIsConnected] = useState(false);
	const [connectionError, setConnectionError] = useState<string | null>(null);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [feedbackGiven, setFeedbackGiven] = useState(false);

	// Simplified signup state
	const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
	const [signupStep, setSignupStep] = useState(1); // 1: username, 2: interests
	const [isLoading, setIsLoading] = useState(false);

	// Initialize socket
	useEffect(() => {
		const initializeSocket = async () => {
			try {
				const { io } = await import('socket.io-client');
				socket = io("http://localhost:5000", { withCredentials: true });
				
				// Connection status handlers
				socket.on('connect', () => {
					console.log('Connected to server');
					setIsConnected(true);
					setConnectionError(null);
				});

				socket.on('disconnect', () => {
					console.log('Disconnected from server');
					setIsConnected(false);
				});

				socket.on('connect_error', (error) => {
					console.error('Connection error:', error);
					setConnectionError('Failed to connect to chat server');
					setIsConnected(false);
				});
			} catch (error) {
				console.error('Failed to initialize socket:', error);
				setConnectionError('Failed to initialize chat connection');
			}
		};

		initializeSocket();

		return () => {
			if (socket) {
				socket.off('connect');
				socket.off('disconnect');
				socket.off('connect_error');
			}
		};
	}, []);

	// User color generator
	const getUserColor = (name: string) => {
		let hash = 0;
		for (let i = 0; i < name.length; i++) {
			hash = name.charCodeAt(i) + ((hash << 5) - hash);
		}
		return colors[Math.abs(hash) % colors.length];
	};

	// Enhanced file handling
	const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				setProfilePicUrl(event.target?.result as string);
				setProfilePicFile(file);
			};
			reader.readAsDataURL(file);
		}
	};

	// Interest selection
	const toggleInterest = (interestId: string) => {
		setSelectedInterests(prev => 
			prev.includes(interestId) 
				? prev.filter(id => id !== interestId)
				: [...prev, interestId]
		);
	};

	// Toggle sidebar for mobile
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	// Close sidebar when clicking outside on mobile
	const handleChatBoxClick = () => {
		if (window.innerWidth <= 768 && isSidebarOpen) {
			setIsSidebarOpen(false);
		}
	};

	useEffect(() => {
		if (!username || !socket) return;

		socket.emit("userJoined", { username, room: currentRoom });

		socket.on("previousMessages", ({ messages, room }) => {
			console.log('Previous messages:', messages);
			if (room === currentRoom) {
				setMessages(messages);
			}
		});

		socket.on("receiveMessage", (data) => {
			console.log('Received message:', data);
			if (data.room === currentRoom) {
				setMessages((prev) => [...prev, { ...data, id: uuidv4() }]);
			}
		});

		socket.on("updateUsers", (users) => {
			console.log('Online users:', users);
			setOnlineUsers(users);
		});
		
		socket.on("userTyping", (user) => {
			setTypingUser(user);
			setTimeout(() => setTypingUser(null), 2000);
		});

		return () => {
			if (socket) {
				socket.off("receiveMessage");
				socket.off("updateUsers");
				socket.off("userTyping");
				socket.off("previousMessages");
			}
		};
	}, [username, currentRoom, socket]);

	// Enhanced join function
	const handleJoin = async (e: React.FormEvent) => {
		e.preventDefault();
		if (signupStep < 2) {
			setSignupStep(signupStep + 1);
			return;
		}

		setIsLoading(true);
		try {
			// Simulate loading
			await new Promise(resolve => setTimeout(resolve, 1000));
			
			setUsername(loginName);
			setLoginName("");
			setSignupStep(1);
			setSelectedInterests([]);
		} catch (error) {
			console.error("Error joining chat:", error);
		} finally {
			setIsLoading(false);
		}
	};

	// Go back to previous step
	const goBack = () => {
		if (signupStep > 1) {
			setSignupStep(signupStep - 1);
		}
	};

	const handleSendMessage = () => {
		if (input.trim() && username && socket) {
			const messageData = {
				id: uuidv4(),
				username,
				message: input,
				room: currentRoom,
				timestamp: new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
				profilePicUrl,
			};

			socket.emit("sendMessage", messageData);
			setInput("");
		}
	};

	const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
		if (username && socket) {
			socket.emit("typing", { username, room: currentRoom });
		}
	};

	const handleEmojiClick = (emoji: any) => {
		setInput((prev) => prev + emoji.emoji);
		setShowEmojiPicker(false);
	};

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	const handleRoomChange = (room: string) => {
		setCurrentRoom(room);
		setMessages([]);
		if (username && socket) {
			socket.emit("userJoined", { username, room });
		}
		// Close sidebar on mobile after room change
		if (window.innerWidth <= 768) {
			setIsSidebarOpen(false);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setProfilePicFile(file);
			const reader = new FileReader();
			reader.onload = (event) => {
				setProfilePicUrl(event.target?.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className={styles.container}>
			{!username ? (
				<div className={styles.loginScreen}>
					{/* Progress indicator */}
					<div className={styles.signupProgress}>
						<div className={`${styles.progressStep} ${signupStep >= 1 ? styles.active : ''}`}>
							<span className={styles.stepNumber}>1</span>
							<span className={styles.stepLabel}>Profile</span>
						</div>
						<div className={`${styles.progressStep} ${signupStep >= 2 ? styles.active : ''}`}>
							<span className={styles.stepNumber}>2</span>
							<span className={styles.stepLabel}>Interests</span>
						</div>
					</div>

					<h1 className={styles.title}>Join the Community</h1>
					
					<form className={styles.loginForm} onSubmit={handleJoin}>
						{/* Step 1: Username and Profile Picture */}
						{signupStep === 1 && (
							<div className={styles.signupStep}>
								<div className={styles.profileSection}>
									<div className={styles.profilePicContainer}>
										<div className={styles.profilePicWrapper}>
											{profilePicUrl ? (
												<img src={profilePicUrl} alt="Profile" className={styles.profilePic} />
											) : (
												<div className={styles.profilePicPlaceholder}>
													👤
												</div>
											)}
											<div className={styles.profilePicOverlay}>
												📷
											</div>
										</div>
										<input
											type="file"
											accept="image/*"
											onChange={handleProfilePicChange}
											className={styles.profilePicInput}
											id="profilePic"
										/>
										<label htmlFor="profilePic" className={styles.profilePicLabel}>
											Choose Photo
										</label>
									</div>
								</div>
								
								<input
									type="text"
									placeholder="Enter your username"
									value={loginName}
									onChange={(e) => setLoginName(e.target.value)}
									className={styles.inputBox}
									required
								/>
								
								<div className={styles.quickUsernameSuggestions}>
									{["MindfulUser", "WellnessWarrior", "PeaceSeeker", "CalmSoul"].map((suggestion) => (
										<button
											key={suggestion}
											type="button"
											className={styles.usernameSuggestion}
											onClick={() => setLoginName(suggestion)}
										>
											{suggestion}
										</button>
									))}
								</div>
							</div>
						)}

						{/* Step 2: Interests Selection */}
						{signupStep === 2 && (
							<div className={styles.signupStep}>
								<h3 className={styles.stepTitle}>What interests you?</h3>
								<p className={styles.stepDescription}>Select topics you'd like to discuss</p>
								
								<div className={styles.interestsGrid}>
									{interestOptions.map((interest) => (
										<button
											key={interest.id}
											type="button"
											className={`${styles.interestOption} ${
												selectedInterests.includes(interest.id) ? styles.selected : ''
											}`}
											onClick={() => toggleInterest(interest.id)}
										>
											<span className={styles.interestEmoji}>{interest.emoji}</span>
											<span className={styles.interestLabel}>{interest.label}</span>
										</button>
									))}
								</div>
								
								{selectedInterests.length > 0 && (
									<div className={styles.selectedInterests}>
										<span>Selected: </span>
										{selectedInterests.map((id) => {
											const interest = interestOptions.find(opt => opt.id === id);
											return (
												<span key={id} className={styles.selectedInterest}>
													{interest?.emoji} {interest?.label}
												</span>
											);
										})}
									</div>
								)}
							</div>
						)}

						{/* Navigation buttons */}
						<div className={styles.signupNavigation}>
							{signupStep > 1 && (
								<button
									type="button"
									className={styles.backButton}
									onClick={goBack}
								>
									← Back
								</button>
							)}
							
							<button 
								type="submit" 
								className={`${styles.startButton} ${isLoading ? styles.loading : ''}`}
								disabled={isLoading || (signupStep === 1 && !loginName.trim())}
							>
								{isLoading ? (
									<>
										<span className={styles.spinner}></span>
										Joining...
									</>
								) : signupStep < 2 ? (
									'Continue →'
								) : (
									'Start Chatting'
								)}
							</button>
						</div>
					</form>

					{/* Welcome message */}
					<div className={styles.welcomeMessage}>
						<p>🌟 Join our supportive community</p>
						<p>💬 Connect with like-minded people</p>
						<p>🤝 Share experiences and find support</p>
					</div>
				</div>
			) : (
				<div className={styles.chatContainer}>
					{/* Mobile Sidebar Toggle */}
					<button 
						className={styles.mobileSidebarToggle}
						onClick={toggleSidebar}
						aria-label="Toggle sidebar"
					>
						<span></span>
						<span></span>
						<span></span>
					</button>

					{/* Sidebar */}
					<div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
						{/* Sidebar Header */}
						<div className={styles.sidebarHeader}>
							<h2 className={styles.sidebarTitle}>Community Chat</h2>
							<p className={styles.onlineUser}>🟢 {onlineUsers.length} online</p>
							{/* Mobile close button */}
							<button 
								className={styles.mobileSidebarClose}
								onClick={() => setIsSidebarOpen(false)}
								aria-label="Close sidebar"
							>
								×
							</button>
						</div>
						
						{/* Connection Status */}
						<div className={`${styles.connectionStatus} ${!isConnected ? styles.disconnected : ''}`}>
							{isConnected ? '🟢 Connected' : '🔴 Disconnected'}
							{connectionError && <div className={styles.connectionError}>{connectionError}</div>}
						</div>

						{/* Online Users List */}
						<div className={styles.onlineUsersList}>
							{onlineUsers.map((user, index) => (
								<div key={index} className={styles.onlineUserItem}>
									<div className={styles.onlineUserAvatar}>
										{user.charAt(0).toUpperCase()}
									</div>
									<div className={styles.onlineUserInfo}>
										<div className={styles.onlineUserName}>{user}</div>
										<div className={styles.onlineUserStatus}>🟢 Online</div>
									</div>
								</div>
							))}
						</div>

						{/* Chat Rooms */}
						<div className={styles.roomsTitle}>Chat Rooms</div>
						<div className={styles.roomsList}>
							<button
								className={`${styles.roomButton} ${currentRoom === "general" ? styles.activeRoom : ""}`}
								onClick={() => handleRoomChange("general")}
							>
								💬 General Chat
							</button>
							<button
								className={`${styles.roomButton} ${currentRoom === "support" ? styles.activeRoom : ""}`}
								onClick={() => handleRoomChange("support")}
							>
								🤝 Support Group
							</button>
							<button
								className={`${styles.roomButton} ${currentRoom === "wellness" ? styles.activeRoom : ""}`}
								onClick={() => handleRoomChange("wellness")}
							>
								🧘 Wellness Tips
							</button>
						</div>

						{/* Theme Toggle */}
						<button className={styles.themeToggle} onClick={toggleTheme}>
							{theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
						</button>
					</div>

					{/* Chat Box */}
					<div className={styles.chatBox} onClick={handleChatBoxClick}>
						{/* Chat Header */}
						<div className={styles.chatHeader}>
							<div className={styles.chatHeaderInfo}>
								<div className={styles.chatHeaderAvatar}>
									{currentRoom.charAt(0).toUpperCase()}
								</div>
								<div className={styles.chatHeaderText}>
									<div className={styles.chatHeaderTitle}>
										{currentRoom === "general" ? "General Chat" : 
										 currentRoom === "support" ? "Support Group" : "Wellness Tips"}
									</div>
									<div className={styles.chatHeaderSubtitle}>
										{onlineUsers.length} members • {isConnected ? 'Online' : 'Offline'}
									</div>
								</div>
							</div>
							<div className={styles.chatHeaderActions}>
								<button className={styles.chatHeaderButton}>📞</button>
								<button className={styles.chatHeaderButton}>📹</button>
								<button className={styles.chatHeaderButton}>⋮</button>
							</div>
						</div>

						{/* Warning Banner */}
						<div className={styles.warningBanner}>
							⚠️ This chat is for support and awareness only. It is not a substitute for professional diagnosis or treatment. If you're in distress, please seek help.
						</div>

						<div className={styles.messagesContainer}>
							{messages.map((msg, index) => (
								<div
									key={index}
									className={`${styles.message} ${
										msg.username === username ? styles.myMessage : styles.otherMessage
									}`}
								>
									{msg.username !== username && (
										<div className={styles.messageHeader}>
											{msg.profilePicUrl && (
												<img src={msg.profilePicUrl} alt="avatar" className={styles.avatar} />
											)}
											<span>{msg.username}</span>
										</div>
									)}
									<div className={styles.messageContent}>{msg.message}</div>
									{msg.timestamp && <div className={styles.timestamp}>{msg.timestamp}</div>}
									{msg.username === username && (
										<div className={styles.readReceipt}>
											✓✓ Seen
										</div>
									)}
								</div>
							))}
							{typingUser && typingUser !== username && (
								<div className={styles.typingArea}>
									{typingUser} is typing
									<span className={styles.typingDots}>
										<span>.</span>
										<span>.</span>
										<span>.</span>
									</span>
								</div>
							)}
						</div>

						{/* Input Container */}
						<div className={styles.inputContainer}>
							<button 
								className={styles.emojiButton}
								onClick={() => setShowEmojiPicker(!showEmojiPicker)}
							>
								😀
							</button>
							{showEmojiPicker && (
								<div className={styles.emojiPickerWrapper}>
									<EmojiPicker onEmojiClick={handleEmojiClick} />
								</div>
							)}
							<input
								type="text"
								value={input}
								onChange={handleTyping}
								onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
								placeholder="Type a message..."
								className={styles.inputField}
							/>
							<button
								onClick={handleSendMessage}
								disabled={!input.trim()}
								className={styles.sendButton}
							>
								📤
							</button>
						</div>
					</div>

					{/* Mobile Overlay */}
					{isSidebarOpen && (
						<div 
							className={styles.mobileOverlay}
							onClick={() => setIsSidebarOpen(false)}
						></div>
					)}
				</div>
			)}

			{!feedbackGiven && messages.length > 0 && (
				<div className={styles.feedbackSection}>
					<p>👥 Was this community chat helpful for your mental wellness?</p>
					<div className={styles.feedbackButtons}>
						<button onClick={() => {
							const mood = (localStorage.getItem("todayMood") || "unknown") as any;
							logFeedback(mood, "community", 1);
							setFeedbackGiven(true);
							// Dispatch custom event to refresh wellness journey
							window.dispatchEvent(new Event('feedback-given'));
						}}>
							Yes
						</button>
						<button onClick={() => {
							const mood = (localStorage.getItem("todayMood") || "unknown") as any;
							logFeedback(mood, "community", 0);
							setFeedbackGiven(true);
							// Dispatch custom event to refresh wellness journey
							window.dispatchEvent(new Event('feedback-given'));
						}}>
							No
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
