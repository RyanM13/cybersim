import Login from "./pages/login";
import SignUp from "./pages/SignUp";
import DashBoard from "./pages/DashBoard";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AuthLayout from "./layouts/authlayout";
import MainLayout from "./layouts/mainlayout";
import Scenario from "./pages/scenario";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Wiki from "./pages/Wiki";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/scenario" element={<Scenario />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/Wiki" element={<Wiki />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

