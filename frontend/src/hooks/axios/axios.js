import axios from "axios";

console.log("baseUrl", import.meta.env.VITE_BACKEND_URL);

const instance = axios.create({
  baseURL: "https://mindfulai-wv9z.onrender.com",
  withCredentials: true, // ✅ Needed for cookies to work!
});

export default instance;
