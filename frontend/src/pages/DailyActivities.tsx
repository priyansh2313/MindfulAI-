// ✅ Enhanced DailyActivities.tsx

import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import FloatingChatbot from "../pages/FloatingChatbot";
import styles from "../styles/DailyActivities.module.css";
import { getUserContext, logFeedback, Mood, updateUserContext } from "../utils/reinforcement";

// Enhanced breathing exercises with difficulty levels and mood targeting
const breathingExercises = [
  { 
    id: 1, 
    activity: "Box Breathing", 
    pattern: [4, 4, 4, 4], 
    phases: ["Inhale", "Hold", "Exhale", "Hold"],
    difficulty: "beginner",
    targetMoods: ["anxious", "stressed"],
    description: "Perfect for calming anxiety and finding focus"
  },
  { 
    id: 2, 
    activity: "4-7-8 Breathing", 
    pattern: [4, 7, 8], 
    phases: ["Inhale", "Hold", "Exhale"],
    difficulty: "intermediate",
    targetMoods: ["anxious", "sad"],
    description: "Great for sleep and deep relaxation"
  },
  { 
    id: 3, 
    activity: "Alternate Nostril", 
    pattern: [4, 4, 4, 4], 
    phases: ["Inhale Left", "Hold", "Exhale Right", "Hold"],
    difficulty: "advanced",
    targetMoods: ["angry", "burnt_out"],
    description: "Balances energy and calms the mind"
  },
  {
    id: 4,
    activity: "Lion's Breath",
    pattern: [3, 1, 6],
    phases: ["Inhale", "Hold", "Exhale with 'Ha'"],
    difficulty: "beginner",
    targetMoods: ["angry", "frustrated"],
    description: "Releases tension and anger"
  }
];

// Dynamic affirmations based on mood and time
const getAffirmations = (mood: string, timeOfDay: string) => {
  const affirmations = {
    anxious: {
      morning: ["I am safe and capable of handling today's challenges.", "Each breath brings me closer to peace."],
      afternoon: ["I trust my ability to navigate uncertainty.", "I am grounded in this moment."],
      evening: ["I release the worries of the day.", "I am preparing for restful sleep."],
      night: ["I am letting go of today's stress.", "I am worthy of peace and rest."]
    },
    sad: {
      morning: ["Today is a new opportunity for joy.", "I am stronger than my sadness."],
      afternoon: ["I allow myself to feel, and that's okay.", "I am worthy of happiness."],
      evening: ["I am grateful for the lessons of today.", "Tomorrow holds new possibilities."],
      night: ["I am safe and loved.", "I am healing with each breath."]
    },
    happy: {
      morning: ["I am excited for today's adventures.", "My joy radiates to others."],
      afternoon: ["I am grateful for this beautiful day.", "I spread positivity wherever I go."],
      evening: ["I am thankful for today's blessings.", "I am content with my journey."],
      night: ["I am peaceful and satisfied.", "I am ready for restful sleep."]
    },
    default: {
      morning: ["I am present and mindful.", "I choose to be kind to myself."],
      afternoon: ["I am balanced and centered.", "I trust the process of life."],
      evening: ["I am grateful for today.", "I am preparing for tomorrow."],
      night: ["I am peaceful and calm.", "I am worthy of rest."]
    }
  };
  
  return affirmations[mood]?.[timeOfDay] || affirmations.default[timeOfDay];
};

// Interactive grounding exercises
const groundingExercises = [
  {
    id: 1,
    name: "5-4-3-2-1 Sensory Grounding",
    steps: [
      "Look around and name 5 things you can see",
      "Touch 4 things and notice their texture",
      "Listen for 3 sounds you can hear",
      "Identify 2 things you can smell",
      "Notice 1 thing you can taste"
    ],
    duration: 300, // 5 minutes
    targetMoods: ["anxious", "overwhelmed"]
  },
  {
    id: 2,
    name: "Body Scan Meditation",
    steps: [
      "Start with your toes - feel their weight",
      "Move to your feet - notice any sensations",
      "Continue up your legs - release tension",
      "Feel your torso - your breath moving",
      "Notice your arms and hands",
      "Finally, scan your head and face"
    ],
    duration: 600, // 10 minutes
    targetMoods: ["stressed", "tired"]
  }
];

// Progressive muscle relaxation
const muscleRelaxation = {
  name: "Progressive Muscle Relaxation",
  muscleGroups: [
    { name: "Forehead", instruction: "Raise your eyebrows, hold for 5 seconds, then relax" },
    { name: "Eyes", instruction: "Squeeze your eyes shut, hold, then release" },
    { name: "Jaw", instruction: "Clench your jaw, hold, then let go" },
    { name: "Shoulders", instruction: "Raise your shoulders to your ears, hold, then drop" },
    { name: "Arms", instruction: "Make fists, hold, then release" },
    { name: "Chest", instruction: "Take a deep breath, hold, then exhale slowly" },
    { name: "Stomach", instruction: "Tighten your stomach muscles, hold, then relax" },
    { name: "Legs", instruction: "Point your toes, hold, then release" }
  ]
};

const moods: Mood[] = ['happy', 'neutral', 'sad', 'anxious', 'angry', 'burnt_out'];

export default function DailyActivities() {
  const [currentExercise, setCurrentExercise] = useState(breathingExercises[0]);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timer, setTimer] = useState(currentExercise.pattern[0]);
  const [isBreathing, setIsBreathing] = useState(false);
  const [affirmationIndex, setAffirmationIndex] = useState(0);
  const [gratitude, setGratitude] = useState("");
  const [chatbotOpen, setChatbotOpen] = useState(true);
  const [cameFromRL, setCameFromRL] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  
  // New interactive states
  const [currentActivity, setCurrentActivity] = useState('breathing');
  const [groundingStep, setGroundingStep] = useState(0);
  const [isGroundingActive, setIsGroundingActive] = useState(false);
  const [muscleGroupIndex, setMuscleGroupIndex] = useState(0);
  const [isMuscleRelaxationActive, setIsMuscleRelaxationActive] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState({
    sessionsCompleted: 0,
    totalMinutes: 0,
    favoriteActivity: 'breathing'
  });

  const storedMood = localStorage.getItem("todayMood") || "unknown";
  const userContext = getUserContext();
  const timeOfDay = userContext?.timeOfDay || 'morning';

  // Get personalized affirmations
  const currentAffirmations = getAffirmations(storedMood, timeOfDay);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const source = localStorage.getItem("rl_action_source");
      if (source === "daily-activities") setCameFromRL(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isBreathing) return;
    const timeout = setTimeout(() => {
      const next = (phaseIndex + 1) % currentExercise.pattern.length;
      setPhaseIndex(next);
      setTimer(currentExercise.pattern[next]);
    }, timer * 1000);
    return () => clearTimeout(timeout);
  }, [phaseIndex, timer, isBreathing, currentExercise]);

  // Load user progress
  useEffect(() => {
    const progress = localStorage.getItem('dailyActivitiesProgress');
    if (progress) {
      const parsed = JSON.parse(progress);
      setDailyStreak(parsed.streak || 0);
      setWeeklyStats(parsed.weeklyStats || weeklyStats);
    }
  }, []);

  const handleExerciseChange = (ex) => {
    setIsBreathing(false);
    setCurrentExercise(ex);
    setPhaseIndex(0);
    setTimer(ex.pattern[0]);
  };

  const nextAffirmation = () => {
    setAffirmationIndex((prev) => (prev + 1) % currentAffirmations.length);
  };

  const startGrounding = () => {
    setIsGroundingActive(true);
    setGroundingStep(0);
    setCurrentActivity('grounding');
  };

  const nextGroundingStep = () => {
    if (groundingStep < groundingExercises[0].steps.length - 1) {
      setGroundingStep(groundingStep + 1);
    } else {
      setIsGroundingActive(false);
      completeSession('grounding');
    }
  };

  const startMuscleRelaxation = () => {
    setIsMuscleRelaxationActive(true);
    setMuscleGroupIndex(0);
    setCurrentActivity('muscle-relaxation');
  };

  const nextMuscleGroup = () => {
    if (muscleGroupIndex < muscleRelaxation.muscleGroups.length - 1) {
      setMuscleGroupIndex(muscleGroupIndex + 1);
    } else {
      setIsMuscleRelaxationActive(false);
      completeSession('muscle-relaxation');
    }
  };

  const completeSession = (activityType: string) => {
    const newStreak = dailyStreak + 1;
    const newStats = {
      ...weeklyStats,
      sessionsCompleted: weeklyStats.sessionsCompleted + 1,
      totalMinutes: weeklyStats.totalMinutes + 5,
      favoriteActivity: activityType
    };
    
    setDailyStreak(newStreak);
    setWeeklyStats(newStats);
    
    localStorage.setItem('dailyActivitiesProgress', JSON.stringify({
      streak: newStreak,
      weeklyStats: newStats,
      lastCompleted: Date.now()
    }));

    // Update user context
    updateUserContext({
      ...userContext,
      lastActionTime: Date.now()
    });
  };

  const getRecommendedExercise = () => {
    const mood = storedMood as Mood;
    return breathingExercises.find(ex => 
      ex.targetMoods.includes(mood)
    ) || breathingExercises[0];
  };

  return (
    <div className={styles.wrapper}>
      <FloatingChatbot
        isOpen={chatbotOpen}
        onToggle={() => setChatbotOpen((prev) => !prev)}
        hoveredSection={null}
        mode="exercise"
      />

      <motion.h1 className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        🧘 Daily Mindfulness
      </motion.h1>

      {/* Progress Dashboard */}
      <motion.div className={styles.progressDashboard} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className={styles.streakCard}>
          <h3>🔥 {dailyStreak} Day Streak</h3>
          <p>Keep going! You're building a healthy habit.</p>
        </div>
        <div className={styles.statsCard}>
          <h3>📊 This Week</h3>
          <p>{weeklyStats.sessionsCompleted} sessions • {weeklyStats.totalMinutes} minutes</p>
          <p>Favorite: {weeklyStats.favoriteActivity}</p>
        </div>
      </motion.div>

      {/* AI Recommendation */}
      <motion.div className={styles.recommendation} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h3>🤖 AI Recommendation</h3>
        <p>Based on your current mood ({storedMood}), we recommend:</p>
        <div className={styles.recommendedExercise}>
          <h4>{getRecommendedExercise().activity}</h4>
          <p>{getRecommendedExercise().description}</p>
          <button 
            onClick={() => handleExerciseChange(getRecommendedExercise())}
            className={styles.recommendationButton}
          >
            Try This Exercise
          </button>
        </div>
      </motion.div>

      {/* Activity Selector */}
      <motion.div className={styles.activitySelector} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <button 
          onClick={() => setCurrentActivity('breathing')}
          className={`${styles.activityTab} ${currentActivity === 'breathing' ? styles.active : ''}`}
        >
          🫁 Breathing
        </button>
        <button 
          onClick={() => setCurrentActivity('grounding')}
          className={`${styles.activityTab} ${currentActivity === 'grounding' ? styles.active : ''}`}
        >
          🌿 Grounding
        </button>
        <button 
          onClick={() => setCurrentActivity('muscle-relaxation')}
          className={`${styles.activityTab} ${currentActivity === 'muscle-relaxation' ? styles.active : ''}`}
        >
          💪 Muscle Relaxation
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {currentActivity === 'breathing' && (
          <motion.div 
            key="breathing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={styles.activityContent}
          >
            <motion.div
              className={styles.breathingCircle}
              animate={{ scale: isBreathing ? [1, 1.3, 1] : 1 }}
              transition={{ duration: timer, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className={styles.phaseText}>{currentExercise.phases[phaseIndex]}</p>
              <p className={styles.timer}>{timer}s</p>
            </motion.div>

            <div className={styles.exerciseSwitcher}>
              {breathingExercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => handleExerciseChange(ex)}
                  className={`${styles.exerciseButton} ${ex.id === currentExercise.id ? styles.active : ""}`}
                >
                  {ex.activity}
                </button>
              ))}
              <button onClick={() => setIsBreathing((prev) => !prev)} className={styles.breathingToggle}>
                {isBreathing ? "Pause" : "Start"}
              </button>
            </div>
          </motion.div>
        )}

        {currentActivity === 'grounding' && (
          <motion.div 
            key="grounding"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={styles.activityContent}
          >
            {!isGroundingActive ? (
              <div className={styles.groundingIntro}>
                <h3>🌿 Grounding Techniques</h3>
                <p>Choose a technique to help you feel present and calm:</p>
                {groundingExercises.map((exercise) => (
                  <div key={exercise.id} className={styles.groundingOption}>
                    <h4>{exercise.name}</h4>
                    <p>Duration: {exercise.duration / 60} minutes</p>
                    <button onClick={startGrounding} className={styles.startButton}>
                      Start {exercise.name}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.groundingActive}>
                <h3>🌿 {groundingExercises[0].name}</h3>
                <div className={styles.groundingStep}>
                  <p className={styles.stepText}>{groundingExercises[0].steps[groundingStep]}</p>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
                      style={{ width: `${((groundingStep + 1) / groundingExercises[0].steps.length) * 100}%` }}
                    />
                  </div>
                  <button onClick={nextGroundingStep} className={styles.nextButton}>
                    {groundingStep < groundingExercises[0].steps.length - 1 ? "Next Step" : "Complete"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {currentActivity === 'muscle-relaxation' && (
          <motion.div 
            key="muscle-relaxation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={styles.activityContent}
          >
            {!isMuscleRelaxationActive ? (
              <div className={styles.muscleIntro}>
                <h3>💪 Progressive Muscle Relaxation</h3>
                <p>Systematically tense and relax each muscle group to release tension:</p>
                <button onClick={startMuscleRelaxation} className={styles.startButton}>
                  Start Muscle Relaxation
                </button>
              </div>
            ) : (
              <div className={styles.muscleActive}>
                <h3>💪 {muscleRelaxation.name}</h3>
                <div className={styles.muscleGroup}>
                  <h4>{muscleRelaxation.muscleGroups[muscleGroupIndex].name}</h4>
                  <p className={styles.instruction}>{muscleRelaxation.muscleGroups[muscleGroupIndex].instruction}</p>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
                      style={{ width: `${((muscleGroupIndex + 1) / muscleRelaxation.muscleGroups.length) * 100}%` }}
                    />
                  </div>
                  <button onClick={nextMuscleGroup} className={styles.nextButton}>
                    {muscleGroupIndex < muscleRelaxation.muscleGroups.length - 1 ? "Next Muscle Group" : "Complete"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className={styles.affirmationBox} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
        <h3>💭 Personalized Affirmations</h3>
        <p className={styles.affirmation}>{currentAffirmations[affirmationIndex]}</p>
        <button className={styles.exerciseButton} onClick={nextAffirmation}>Next Affirmation</button>
      </motion.div>

      <motion.div className={styles.gratitude} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
        <h2>🌸 Gratitude Reflection</h2>
        <textarea
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
          placeholder="Write 3 things you're grateful for today..."
        />
        {gratitude.length > 5 && (
          <p style={{ color: "#2a9d8f", marginTop: "1rem" }}>
            🌟 Thank you for reflecting today.
          </p>
        )}
      </motion.div>

      {!feedbackGiven && (
        <div className={styles.feedbackSection}>
          <p>🧘 Was this session helpful?</p>
          <div className={styles.feedbackButtons}>
            <button onClick={() => {
              const mood = (localStorage.getItem("todayMood") || "unknown") as Mood;
              logFeedback(mood, "daily-activities", 1);
              setFeedbackGiven(true);
            }}>
              Yes
            </button>
            <button onClick={() => {
              const mood = (localStorage.getItem("todayMood") || "unknown") as Mood;
              logFeedback(mood, "daily-activities", 0);
              setFeedbackGiven(true);
            }}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
