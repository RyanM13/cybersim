import { LoginForm } from "@/components/login-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const USER = [
  { username: "Ryan", password: "password" },
  { username: "testuser", password: "test123" },
];

export default function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlelogin = (username, password) => {
    setError("");

    const user = USER.find((u) => u.username === username);

    if (!user) {
      setError("Username not found");
      return;
    }

    if (user.password !== password) {
      setError("Username not found");
      return;
    }

    navigate("/dashboard");
  };

  return <LoginForm onLogin={handlelogin} error={error} />;
}
