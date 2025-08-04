// src/components/EmotionClassifierFaceAPI.tsx
import * as faceapi from '@vladmandic/face-api';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from "../styles/FaceMood.module.css";

interface Props {
  onMoodDetected: (mood: string) => void;
}

const EmotionClassifierFaceAPI = ({ onMoodDetected }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastMood = useRef("neutral");
  const moodStableCount = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const startVideo = async () => {
    try {
      console.log("🎥 Starting video stream...");
      
      // Check if video element exists
      if (!videoRef.current) {
        console.error("❌ Video ref is null, waiting for element to render...");
        // Wait a bit more for the video element to be available
        setTimeout(() => startVideo(), 200);
        return;
      }
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API not supported in this browser");
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      console.log("📹 Camera stream obtained:", stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log("✅ Video stream started successfully");
          videoRef.current?.play().then(() => {
            console.log("🎬 Video is now playing");
            console.log("📏 Video dimensions:", videoRef.current?.videoWidth, "x", videoRef.current?.videoHeight);
            console.log("📐 Video element dimensions:", videoRef.current?.offsetWidth, "x", videoRef.current?.offsetHeight);
          }).catch(e => console.error("❌ Video play error:", e));
        };
        videoRef.current.onerror = (e) => {
          console.error("❌ Video element error:", e);
        };
        videoRef.current.onplay = () => {
          console.log("🎬 Video play event fired");
        };
        videoRef.current.oncanplay = () => {
          console.log("🎬 Video can play event fired");
        };
      } else {
        console.error("❌ Video ref is still null after waiting");
      }
    } catch (err) {
      console.error("❌ Camera access error:", err);
      setError(`Camera access denied: ${err.message}. Please allow camera permissions and refresh.`);
    }
  };

  const detectMood = async () => {
    if (!videoRef.current || isLoading || error) return;

    try {
      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (!detections) {
        console.log("😐 No face detected");
        return;
      }

      if (detections.expressions) {
        const sorted = Object.entries(detections.expressions).sort((a, b) => b[1] - a[1]);
        const [topMood, confidence] = sorted[0];

        console.log(`🎭 Detected mood: ${topMood} (confidence: ${confidence.toFixed(2)})`);

        if (confidence > 0.5) {
          if (topMood === lastMood.current) {
            moodStableCount.current++;
            if (moodStableCount.current >= 2) {
              console.log(`✅ Stable mood detected: ${topMood}`);
              onMoodDetected(topMood);
            }
          } else {
            lastMood.current = topMood;
            moodStableCount.current = 1;
          }
        }
      }
    } catch (err) {
      console.error("❌ Error during mood detection:", err);
    }
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const MODEL_URL = "/models";
        console.log("Loading face detection models from:", MODEL_URL);
        
        // Load the required models from CDN (local models are TensorFlow.js format, not compatible with face-api.js)
        try {
          console.log("🔄 Loading face-api.js models from CDN...");
          await faceapi.nets.tinyFaceDetector.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/');
          await faceapi.nets.faceExpressionNet.loadFromUri('https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/');
          console.log("✅ CDN models loaded successfully");
        } catch (cdnError) {
          console.error("❌ Failed to load models from CDN:", cdnError);
          console.log("🔄 Trying alternative CDN...");
          try {
            await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1/dist/weights/');
            await faceapi.nets.faceExpressionNet.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1/dist/weights/');
            console.log("✅ Alternative CDN models loaded successfully");
          } catch (altError) {
            console.error("❌ Failed to load models from both CDNs:", altError);
            throw new Error("Unable to load face detection models. Please check your internet connection.");
          }
        }
        
        console.log("✅ Face detection models loaded successfully");
        console.log("🔄 Setting isLoading to false...");
        setIsLoading(false);
        console.log("✅ isLoading should now be false");
      } catch (err) {
        console.error("❌ Error loading face detection models:", err);
        setError("Failed to load face detection models. Please refresh the page.");
        setIsLoading(false);
      }
    };



    loadModels();
  }, [onMoodDetected]);

  // Separate useLayoutEffect for starting video after component is rendered
  useLayoutEffect(() => {
    if (!isLoading && !error && videoRef.current) {
      console.log("🎬 Component rendered, starting video...");
      startVideo();
      const interval = setInterval(detectMood, 1000);
      return () => clearInterval(interval);
    }
  }, [isLoading, error]);

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>❌ {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className={styles.retryButton}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <video ref={videoRef} autoPlay muted playsInline className={styles.video} style={{ display: 'none' }} />
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading face detection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <video ref={videoRef} autoPlay muted playsInline className={styles.video} />
      {/* Removed overlay to allow face detection to work properly */}
    </div>
  );
};

export default EmotionClassifierFaceAPI;
