import Login from "./pages/login";
import DashBoard from "./pages/DashBoard";
import { BrowserRouter, Router, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/authlayout";
import MainLayout from "./layouts/mainlayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashBoard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
