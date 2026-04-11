import Header from "@/components/header";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function MainLayout() {
  // Using useAuth hook to check users token status
  const { isLoggedIn } = useAuth();

  // Redirecting user to login if no token
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex min-h-[calc(90vh-4rem)] ml-3.5 mt-9">
        {/* body of website */}
        <Outlet />
      </main>
    </div>
  );
}
