import axios from "axios";

console.log("baseUrl", import.meta.env.VITE_BACKEND_URL);

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "https://f73b6cc98bd6.ngrok-free.app",
  withCredentials: true, // ✅ Needed for cookies to work!
});

// Add request interceptor to include JWT token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Remove strict content-type check for debugging Google OAuth
instance.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios error:', error);
    return Promise.reject(error);
  }
);

export default instance;

// export const googleAuth = (code) => instance.get(`auth/google?code=${code}`);
