import axios from "axios";

console.log("baseUrl", import.meta.env.VITE_BACKEND_URL);

const instance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // ✅ Needed for cookies to work!
});

export default instance;
