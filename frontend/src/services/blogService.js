import api from "../lib/axios";

export const getPosts = () => api.get("/blog/");
export const getPost = (id) => api.get(`/blog/${id}`);
export const createPost = (data) => api.post("/blog/", data);
export const deletePost = (id) => api.delete(`/blog/${id}`);