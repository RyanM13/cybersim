import axios from "axios";

// Starting axios server to connect to backend api
const api = axios.create({
  baseURL: "http://localhost:8000",
});

export default api;
