import api from "../lib/axios";

// Claude: How do I connect axios to my backend
//
// Accepts username and password, calls backend for authentication.
// receives validation
export async function login(username, password) {
  const { data } = await api.post("/auth/login", { username, password });
  localStorage.setItem("token", data.access_token);
  return data;
}

// Accepts username and password, calls backend to creates user, logs in
export async function signup(username, password) {
  await api.post("/auth/signup", { username, password });
  return login(username, password);
}

// Calls backend, backend remmoves token.
export function logout() {
  localStorage.removeItem("token");
}
