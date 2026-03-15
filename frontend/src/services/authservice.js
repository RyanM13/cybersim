import api from "../lib/axios";

// Claude: How do I connect axios to my backend
export async function login(username, password) {
  const { data } = await api.post("/auth/login", { username, password });
  localStorage.setItem("token", data.access_token);
  return data;
}

export async function signup(username, password) {
  await api.post("/auth/signup", { username, password });
  return login(username, password);
}

export function logout() {
  localStorage.removeItem("token");
}
