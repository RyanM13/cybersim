import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import SignUp from "@/pages/SignUp";
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

export function LoginForm({ className, ...props }) {
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
          <form>
            <FieldGroup className="space-y-9">
              <Field>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input id="username" type="text" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" required />
              </Field>
              <Field className="mt-5">
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
