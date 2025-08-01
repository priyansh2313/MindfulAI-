import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Brain, Heart, Lightbulb, Search, Shield, Target, Users, Zap } from "lucide-react";
import React, { useEffect, useState } from "react";
import styles from "../styles/Encyclopedia.module.css";
import FloatingChatbot from "./FloatingChatbot";

const disorders = [
  {
    name: "Generalized Anxiety Disorder (GAD)",
    description: "A condition characterized by excessive, uncontrollable worry about various aspects of life.",
    symptoms: ["Constant worry", "Restlessness", "Fatigue", "Difficulty concentrating", "Irritability"],
    treatment: "Cognitive Behavioral Therapy (CBT), medication, and mindfulness techniques.",
    image: "https://images.unsplash.com/photo-1557825835-78a94f193ed2",
    category: "Anxiety",
    severity: "Moderate",
    icon: Brain,
    color: "#FF6B6B"
  },
  {
    name: "Major Depressive Disorder (MDD)",
    description: "A mood disorder causing persistent feelings of sadness and loss of interest.",
    symptoms: ["Persistent sadness", "Loss of interest in activities", "Changes in appetite", "Fatigue", "Suicidal thoughts"],
    treatment: "Therapy, antidepressants, exercise, and a strong support system.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    category: "Mood",
    severity: "Severe",
    icon: Heart,
    color: "#4ECDC4"
  },
  {
    name: "Panic Disorder",
    description: "A disorder causing sudden, intense episodes of fear (panic attacks) without a clear trigger.",
    symptoms: ["Rapid heartbeat", "Shortness of breath", "Dizziness", "Sweating", "Fear of losing control"],
    treatment: "Cognitive therapy, medication, and relaxation techniques.",
    image: "https://images.unsplash.com/photo-1603570419885-3d2e3bba36c3",
    category: "Anxiety",
    severity: "High",
    icon: Zap,
    color: "#45B7D1"
  },
  {
    name: "Schizophrenia",
    description: "A severe mental disorder affecting thoughts, emotions, and behaviors, often including hallucinations.",
    symptoms: ["Hallucinations", "Delusions", "Disorganized thinking", "Lack of motivation", "Social withdrawal"],
    treatment: "Antipsychotic medication, therapy, and psychosocial support.",
    image: "https://images.unsplash.com/photo-1558981033-0a93f05cc0e9",
    category: "Psychotic",
    severity: "Severe",
    icon: Brain,
    color: "#96CEB4"
  },
  {
    name: "Obsessive-Compulsive Disorder (OCD)",
    description: "A disorder characterized by unwanted repetitive thoughts and compulsive behaviors.",
    symptoms: ["Obsessive thoughts", "Compulsive actions", "Fear of contamination", "Need for symmetry", "Intrusive thoughts"],
    treatment: "CBT, exposure therapy, and medication.",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28cf",
    category: "Anxiety",
    severity: "Moderate",
    icon: Target,
    color: "#FFEAA7"
  },
  {
    name: "Post-Traumatic Stress Disorder (PTSD)",
    description: "A disorder that can develop after exposure to a traumatic event.",
    symptoms: ["Flashbacks", "Nightmares", "Severe anxiety", "Avoidance of reminders", "Hypervigilance"],
    treatment: "Trauma-focused therapy, EMDR, and medications.",
    image: "https://images.unsplash.com/photo-1548095115-45697e01925f",
    category: "Trauma",
    severity: "High",
    icon: Shield,
    color: "#DDA0DD"
  },
  {
    name: "Borderline Personality Disorder (BPD)",
    description: "A mental illness characterized by unstable moods, behavior, and relationships.",
    symptoms: ["Fear of abandonment", "Intense mood swings", "Impulsive behavior", "Self-harm", "Unstable self-image"],
    treatment: "Dialectical Behavioral Therapy (DBT), mood stabilizers, and emotional regulation strategies.",
    image: "https://images.unsplash.com/photo-1514632953535-573adf31c0f2",
    category: "Personality",
    severity: "High",
    icon: Users,
    color: "#FF8B94"
  },
  {
    name: "Bipolar Disorder",
    description: "A mental illness causing extreme mood swings, including manic and depressive episodes.",
    symptoms: ["Extreme mood swings", "Impulsivity", "Euphoria", "Fatigue", "Suicidal thoughts"],
    treatment: "Mood stabilizers, therapy, and lifestyle adjustments.",
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    category: "Mood",
    severity: "Severe",
    icon: Zap,
    color: "#FFD93D"
  },
  {
    name: "Attention Deficit Hyperactivity Disorder (ADHD)",
    description: "A neurodevelopmental disorder affecting attention, impulse control, and hyperactivity.",
    symptoms: ["Inattention", "Impulsivity", "Hyperactivity", "Disorganization", "Difficulty focusing"],
    treatment: "Medication, behavioral therapy, and time management strategies.",
    image: "https://images.unsplash.com/photo-1582719478148-40a4e4c3b5b1",
    category: "Neurodevelopmental",
    severity: "Moderate",
    icon: Brain,
    color: "#6C5CE7"
  },
  {
    name: "Eating Disorders (Anorexia & Bulimia)",
    description: "Severe disturbances in eating behavior related to body image concerns.",
    symptoms: ["Extreme weight loss or gain", "Obsession with food", "Binge eating", "Self-induced vomiting", "Excessive exercise"],
    treatment: "Nutritional counseling, therapy, and medication.",
    image: "https://images.unsplash.com/photo-1589927986089-35812388d1d5",
    category: "Eating",
    severity: "Severe",
    icon: Heart,
    color: "#A8E6CF"
  },
  {
    name: "Social Anxiety Disorder (SAD)",
    description: "An intense fear of social situations, leading to avoidance behavior.",
    symptoms: ["Fear of social interaction", "Blushing", "Sweating", "Trembling", "Avoidance of public speaking"],
    treatment: "CBT, exposure therapy, and anti-anxiety medication.",
    image: "https://images.unsplash.com/photo-1518081461904-9d8de7b413d5",
    category: "Anxiety",
    severity: "Moderate",
    icon: Users,
    color: "#FFB6C1"
  },
  {
    name: "Dissociative Identity Disorder (DID)",
    description: "A disorder where two or more distinct identities control an individual's behavior.",
    symptoms: ["Multiple identities", "Memory gaps", "Emotional detachment", "Depersonalization", "Confusion about identity"],
    treatment: "Trauma-focused therapy and integration techniques.",
    image: "https://images.unsplash.com/photo-1541516160071-84f0f88cdd3f",
    category: "Dissociative",
    severity: "Severe",
    icon: Brain,
    color: "#C7CEEA"
  },
  {
    name: "Seasonal Affective Disorder (SAD - Winter Depression)",
    description: "A type of depression that occurs at certain times of the year, usually in winter.",
    symptoms: ["Low energy", "Irritability", "Oversleeping", "Weight gain", "Feeling hopeless"],
    treatment: "Light therapy, antidepressants, and vitamin D supplements.",
    image: "https://images.unsplash.com/photo-1607305387296-07c6d2f683ed",
    category: "Mood",
    severity: "Moderate",
    icon: Lightbulb,
    color: "#FFE4B5"
  }
];

const categories = ["All", "Anxiety", "Mood", "Psychotic", "Trauma", "Personality", "Neurodevelopmental", "Eating", "Dissociative"];

const Encyclopedia = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDisorder, setSelectedDisorder] = useState<any>(null);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const filteredDisorders = disorders.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         d.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || d.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <motion.div
          className={styles.loadingSpinner}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={styles.loadingText}
        >
          Loading Mental Health Encyclopedia...
        </motion.h2>
      </div>
    );
  }

  return (
    <>
      <FloatingChatbot
        isOpen={chatbotOpen}
        onToggle={() => setChatbotOpen((prev) => !prev)}
        hoveredSection={"encyclopedia"}
        mode="encyclopedia"
      />

      <div className={styles.wrapper}>
        {/* Animated Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.titleContainer}>
            <motion.h1 
              className={styles.title}
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🧠 Mental Health Encyclopedia
            </motion.h1>
            <motion.p 
              className={styles.subtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Explore, Learn, Understand - Your Guide to Mental Wellness
            </motion.p>
          </div>
        </motion.div>

        {/* Interactive Search Bar */}
        <motion.div
          className={styles.searchContainer}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="🔍 Search disorders, symptoms, or treatments..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <motion.div 
            className={styles.searchStats}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {filteredDisorders.length} disorders found
          </motion.div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className={styles.categoryFilter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Disclaimer Banner */}
        <motion.div
          className={styles.disclaimerBanner}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Shield className={styles.disclaimerIcon} />
          <div className={styles.disclaimerContent}>
            <strong>Important Disclaimer:</strong> Mindful AI is a supportive tool, not a diagnosis or treatment. 
            For severe mental health issues, please consult a qualified mental health professional.
          </div>
        </motion.div>

        {/* Disorder Cards Grid */}
        <motion.div
          className={styles.cardContainer}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {filteredDisorders.length > 0 ? (
              filteredDisorders.map((disorder, index) => {
                const IconComponent = disorder.icon;
                return (
                  <motion.div
                    key={disorder.name}
                    className={styles.card}
                    variants={cardVariants}
                    whileHover="hover"
                    onClick={() => setSelectedDisorder(disorder)}
                    style={{ '--card-color': disorder.color } as React.CSSProperties}
                  >
                    <div className={styles.cardHeader}>
                      <div className={styles.cardIcon}>
                        <IconComponent size={24} />
                      </div>
                      <div className={styles.cardBadges}>
                        <span className={styles.categoryBadge}>{disorder.category}</span>
                        <span className={styles.severityBadge}>{disorder.severity}</span>
                      </div>
                    </div>
                    
                    <div className={styles.cardImageContainer}>
                      <img src={disorder.image} alt={disorder.name} className={styles.cardImage} />
                      <div className={styles.cardOverlay}>
                        <BookOpen className={styles.overlayIcon} />
                        <span>Click to learn more</span>
                      </div>
                    </div>
                    
                    <h2 className={styles.cardTitle}>{disorder.name}</h2>
                    <p className={styles.description}>{disorder.description}</p>
                    
                    <div className={styles.cardFooter}>
                      <motion.button
                        className={styles.learnMoreBtn}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Learn More →
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                className={styles.noResults}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Search className={styles.noResultsIcon} />
                <h3>No disorders found</h3>
                <p>Try adjusting your search or category filter</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Modal for Detailed View */}
        <AnimatePresence>
          {selectedDisorder && (
            <motion.div
              className={styles.modalOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDisorder(null)}
            >
              <motion.div
                className={styles.modal}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ '--modal-color': selectedDisorder.color } as React.CSSProperties}
              >
                <div className={styles.modalHeader}>
                  <div className={styles.modalIcon}>
                    {React.createElement(selectedDisorder.icon, { size: 32 })}
                  </div>
                  <div className={styles.modalTitle}>
                    <h2>{selectedDisorder.name}</h2>
                    <div className={styles.modalBadges}>
                      <span className={styles.categoryBadge}>{selectedDisorder.category}</span>
                      <span className={styles.severityBadge}>{selectedDisorder.severity}</span>
                    </div>
                  </div>
                  <button
                    className={styles.modalClose}
                    onClick={() => setSelectedDisorder(null)}
                  >
                    ×
                  </button>
                </div>
                
                <div className={styles.modalContent}>
                  <img src={selectedDisorder.image} alt={selectedDisorder.name} className={styles.modalImage} />
                  <p className={styles.modalDescription}>{selectedDisorder.description}</p>
                  
                  <div className={styles.modalSection}>
                    <h3>🔄 Symptoms</h3>
                    <ul className={styles.modalList}>
                      {selectedDisorder.symptoms.map((symptom, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          {symptom}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={styles.modalSection}>
                    <h3>💊 Treatment</h3>
                    <p>{selectedDisorder.treatment}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!feedbackGiven && (searchTerm || selectedDisorder) && (
        <div className={styles.feedbackSection}>
          <p>📚 Was this mental health encyclopedia helpful?</p>
          <div className={styles.feedbackButtons}>
            <button onClick={() => {
              const mood = (localStorage.getItem("todayMood") || "unknown") as any;
              logFeedback(mood, "encyclopedia", 1);
              setFeedbackGiven(true);
              // Dispatch custom event to refresh wellness journey
              window.dispatchEvent(new Event('feedback-given'));
            }}>
              Yes
            </button>
            <button onClick={() => {
              const mood = (localStorage.getItem("todayMood") || "unknown") as any;
              logFeedback(mood, "encyclopedia", 0);
              setFeedbackGiven(true);
              // Dispatch custom event to refresh wellness journey
              window.dispatchEvent(new Event('feedback-given'));
            }}>
              No
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Encyclopedia;
