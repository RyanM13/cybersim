import Header from "@/components/header";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header minimal />
      <main className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  );
}
