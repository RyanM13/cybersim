import api from "../lib/axios";

const api = axios.create({
  baseURL: "https://special-space-engine-7xrgxw6wv4ghpj7p-8000.app.github.dev",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getPosts = () => api.get("/blog/");
export const getPost = (id) => api.get(`/blog/${id}`);
export const createPost = (data) => api.post("/blog/", data);
export const deletePost = (id) => api.delete(`/blog/${id}`);