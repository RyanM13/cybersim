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

export function LoginForm({ className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-7", className)} {...props}>
      <Card className="w-130.75 h-145">
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
                <Input
                  className="h-13.75"
                  id="username"
                  type="username"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  className="h-13.75"
                  type="password"
                  required
                />
              </Field>
              <Field className="mt-10">
                <Button type="submit">Login</Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
