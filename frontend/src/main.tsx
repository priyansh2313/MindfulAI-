import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'regenerator-runtime/runtime';
import App from './App.tsx';
import './assets/index.css';
import store from './redux/store.js';

// Initialize TensorFlow.js safely
const initializeTF = async () => {
  try {
    // Only try to load TensorFlow.js in browser environment
    if (typeof window !== 'undefined') {
      const tf = await import('@tensorflow/tfjs');
      await import('@tensorflow/tfjs-backend-webgl');
      
      await tf.setBackend('webgl');
      await tf.ready();
      console.log("✅ TensorFlow.js WebGL backend is ready");
    }
  } catch (error) {
    console.warn("⚠️ TensorFlow.js initialization failed:", error);
    console.log("ℹ️ App will continue without TensorFlow.js features");
  }
};

// Initialize app
const initializeApp = async () => {
  // Don't wait for TensorFlow.js to initialize
  initializeTF().catch(() => {
    console.log("TensorFlow.js failed to initialize, continuing without ML features");
  });
  
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>
  );
};

initializeApp();
