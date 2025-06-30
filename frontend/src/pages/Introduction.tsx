import { Brain, Cloud, Eye, Heart, Moon, Smile, Star, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Introduction.module.css";

const ICONS = [Brain, Heart, Smile, Sun, Star, Moon, Cloud, Eye] as const;

export default function Introduction() {
  const navigate = useNavigate();
  const cursor = useRef<HTMLDivElement>(null);
  const burstContainer = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [consentStep, setConsentStep] = useState<"intro"|"consent"|"burst">("intro");

  // custom cursor follow
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!cursor.current) return;
      cursor.current.style.transform = `translate(${e.clientX - 25}px, ${e.clientY - 25}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // hover to 50%
  const handleHover = () => {
    if (consentStep === "intro") setProgress(50);
  };
  const handleLeave = () => {
    if (consentStep === "intro") setProgress(0);
  };

  // first click: show consent message
  const handleStart = () => {
    if (consentStep === "intro") {
      setConsentStep("consent");
      setProgress(0);
    }
  };

  // after consent, trigger burst and navigate
  const handleConsent = () => {
    setConsentStep("burst");
    setProgress(100);
    burstParticles();
    setTimeout(() => navigate("/questionnaire"), 500);
  };

  // create and animate particles
  const burstParticles = () => {
    if (!burstContainer.current) return;
    const count = 30;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = styles.particle;
      p.style.left = "0px";
      p.style.top = "0px";
      const angle = Math.random() * Math.PI * 2;
      const v = Math.random() * 60 + 40;
      p.style.setProperty("--dx", `${Math.cos(angle) * v}px`);
      p.style.setProperty("--dy", `${Math.sin(angle) * v}px`);
      burstContainer.current.appendChild(p);
      p.addEventListener("animationend", () => {
        burstContainer.current?.removeChild(p);
      }, { once: true });
    }
  };

  return (
    <div className={styles.hero}>
      <div className={styles.cursor} ref={cursor} />

      <div className={styles.blobs}>
        <div className={styles.blob} />
        <div className={styles.blob} />
        <div className={styles.blob} />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to Mindful AI</h1>
        <p className={styles.subtitle}>
          Your mental well-being journey starts right here.
        </p>

       {/* INTRO CTA */}
        {consentStep === "intro" && (
          <button
            className={styles.cta}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
            onClick={handleStart}
          >
            Start Assessing
          </button>
        )}

        {/* CONSENT MODAL */}
        {consentStep === "consent" && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalCard}>
              <button
                className={styles.modalClose}
                onClick={() => setConsentStep("intro")}
                aria-label="Close"
              >
                ✕
              </button>
              <p className={styles.consentText}>
                Before moving forward, we’d like you to answer a few quick questions to understand you better.
              </p>
              <button className={styles.consentBtn} onClick={handleConsent}>
                Got it!
              </button>
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className={styles.progressContainer}>
          <span className={styles.progressLabel}>
            5 Steps → {progress}% Complete
          </span>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
