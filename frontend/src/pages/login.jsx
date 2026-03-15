import { LoginForm } from "@/components/login-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/services/authService";

export default function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlelogin = async (username, password) => {
    setError("");
    try {
      await login(username, password);
      navigate("/dashboard");

      // Claude: How do I handle the errors for login
    } catch (err) {
      if (err.response?.status === 404) setError("Username not found");
      else if (err.response?.status === 401) setError("Incorrect password");
      else setError("Something went wrong");
    }
  };

  return <LoginForm onLogin={handlelogin} error={error} />;
}
