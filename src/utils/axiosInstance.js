import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://your-backend-url.com/api", // replace with your backend URL
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
