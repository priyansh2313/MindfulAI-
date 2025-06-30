import axios from "axios";

console.log("baseUrl", import.meta.env.VITE_BACKEND_URL);

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // ✅ Needed for cookies to work!
});

export default instance;
