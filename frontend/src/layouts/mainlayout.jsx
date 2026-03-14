import Header from "@/components/header";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function MainLayout() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <>
      <div>
        <Header />
      </div>

      <div className="flex items-center justify-center">
        <Outlet />
      </div>
    </>
  );
}
