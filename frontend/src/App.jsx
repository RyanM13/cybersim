import Login from "./pages/login";
import SignUp from "./pages/SignUp";
import DashBoard from "./pages/DashBoard";
import { BrowserRouter, Router, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/authlayout";
import MainLayout from "./layouts/mainlayout";
import Scenario from "./pages/scenario";

function App() {
  return (
    // Establishing browserrouter to enable routing between pages
    <BrowserRouter>
      <Routes>
        {/* routing to authlayout for signup and login */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* routing to mainlayout for all other pages */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/dashboard/scenario" element={<Scenario />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Exporting app for other files to use
export default App;
