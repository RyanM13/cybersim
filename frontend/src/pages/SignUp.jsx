import { SignupForm } from "@/components/signup-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "@/services/authService";

export default function SignUp() {
  // useState variables for changeable and useable variables
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // waits for api to receive username and password for validation
  const handleSignup = async (username, password) => {
    setError("");
    try {
      await signup(username, password);
      navigate("/dashboard");
      // Claude: How do I handle the errors
    } catch (err) {
      if (err.response?.status === 402) setError("Username already taken");
      else setError("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* using shadcn signupform  */}
        <SignupForm onSignup={handleSignup} error={error} />
      </div>
    </div>
  );
}
