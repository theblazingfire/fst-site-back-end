import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://example.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
