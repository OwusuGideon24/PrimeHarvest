import axios from "axios";

const apiUrl =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

console.log("Vite environment API URL:", import.meta.env.VITE_API_URL);
console.log("Axios API URL:", apiUrl);

const api = axios.create({
  baseURL: apiUrl,
});

export default api;