import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'regenerator-runtime/runtime';
import App from './App.tsx';
import './assets/index.css';
import store from './redux/store.js';


const initializeTF = async () => {
  await tf.setBackend('webgl');
  await tf.ready();
  console.log("✅ TensorFlow.js WebGL backend is ready");
};

initializeTF().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
      <App />
      </Provider>
  </StrictMode>
  );
});
