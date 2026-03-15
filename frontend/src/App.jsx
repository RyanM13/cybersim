import Login from "./pages/login";
import SignUp from "./pages/SignUp";
import DashBoard from "./pages/DashBoard";
import { BrowserRouter, Router, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/authlayout";
import MainLayout from "./layouts/mainlayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashBoard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
