import { useState } from "react";

export function useAuth() {
  // Checking to see if user has token/authenticated
  const [isLoggedIn] = useState(!!localStorage.getItem("token"));
  return { isLoggedIn };
}
