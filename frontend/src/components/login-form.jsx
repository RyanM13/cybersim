import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useState } from "react";

export function LoginForm({ onLogin, error, className, ...props }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // logs in user
  const handleSubmit = (e) => {
    // Prevents state from being lost
    e.preventDefault();
    // Validates information
    onLogin(username, password);
  };
  return (
    <div
      className={cn(
        "flex flex-col gap-7 w-full max-w-md md:max-w-lg lg:max-w-xl px-4",
        className,
      )}
      {...props}
    >
      <Card>
        <CardHeader className="text-center space-y-4">
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your Username and password below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup className="space-y-9">
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
              <Field className="mt-5">
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}
                <Button type="submit" className="w-full">
                  Login
                </Button>
                <FieldDescription className="text-center">
                  Don't have an account? <Link to="/signup">Sign Up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
