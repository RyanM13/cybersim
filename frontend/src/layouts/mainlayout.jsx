import Header from "@/components/header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="flex h-auto">
      <Header />
      <div className="w-1/2 h-1/2 ">
        <Outlet />
      </div>
    </div>
  );
}
