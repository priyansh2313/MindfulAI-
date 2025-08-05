import axios from "axios";

console.log("baseUrl", import.meta.env.VITE_BACKEND_URL);

const instance = axios.create({
  baseURL: "http://localhost:5000",
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

// Add response interceptor to handle HTML responses
instance.interceptors.response.use(
  (response) => {
    // Check if response is JSON
    const contentType = response.headers['content-type'];
    if (contentType && !contentType.includes('application/json')) {
      console.error('Server returned non-JSON response:', contentType);
      throw new Error('Server returned HTML instead of JSON. The service might be down.');
    }
    return response;
  },
  (error) => {
    console.error('Axios error:', error);
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      console.error('Server error:', error.response.status, error.response.statusText);
      
      // Check if response is HTML
      const contentType = error.response.headers['content-type'];
      if (contentType && contentType.includes('text/html')) {
        console.error('Server returned HTML error page instead of JSON');
        throw new Error('Service temporarily unavailable. Please try again later.');
      }
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.request);
      throw new Error('Unable to connect to server. Please check your internet connection.');
    } else {
      // Other error
      console.error('Request setup error:', error.message);
      throw new Error('Request failed. Please try again.');
    }
    
    return Promise.reject(error);
  }
);

export default instance;
