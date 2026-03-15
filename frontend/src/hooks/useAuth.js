import { useState } from "react";

export function useAuth() {
  const [isLoggedIn] = useState(!!localStorage.getItem("token"));
  return { isLoggedIn };
}
