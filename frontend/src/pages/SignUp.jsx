import { SignupForm } from "@/components/signup-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "@/services/authService";

export default function SignUp() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (username, password) => {
    setError("");
    try {
      await signup(username, password);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 402) setError("Username already taken");
      else setError("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm onSignup={handleSignup} error={error} />
      </div>
    </div>
  );
}
