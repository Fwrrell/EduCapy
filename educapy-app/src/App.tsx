import { useState } from "react";
import Navbar from "./components/upperMenu";
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./pages/Login";
import Kelas from "./pages/Kelas";
import Sidebar from "./components/sidebar";
import MainPage from "./pages/MainPages";
import Jadwal from "./pages/Jadwal";
import Register from "./pages/Register";
const DashboardLayout = () => {
  const isAuthenticated = localStorage.getItem("isLoggedIn") === "true";
  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }
  return (
    <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <Navbar />

        <Outlet />
      </main>
    </div>
  );
};
function App() {
  return (
    <>
      <BrowserRouter>
        <div className="flex h-screen w-full bg-[#f8fafc] overflow-hidden">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Navigate to="/MainPage" replace />} />
              <Route path="/MainPage" element={<MainPage />} />
              <Route path="/jadwal" element={<Jadwal />} />
              <Route path="/kelas" element={<Kelas />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
