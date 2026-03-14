import Header from "@/components/header";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function MainLayout() {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-auto">
      <Header />
      <div className="w-1/2 h-1/2 ">
        <Outlet />
      </div>
    </div>
  );
}
