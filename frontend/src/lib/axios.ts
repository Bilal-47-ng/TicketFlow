import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error("VITE_API_URL is not defined");
}

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export default api;
