import { useState } from "react";
import Navbar from "@/components/upperMenu";
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "@/pages/Login";
import Sidebar from "@/components/sidebar";
import MainPage from "@/pages/MainPages";
import Jadwal from "@/pages/Jadwal";
import Register from "@/pages/Register";
import Kelas from "./pages/Kelas";

import DashboardPage from "./pages/guru/DashboardPage";
import KetersediaanPage from "./pages/guru/KetersediaanPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import ManajemenMurid from "./pages/admin/ManajemenMurid";
import ManajemenGuru from "./pages/admin/ManajemenGuru";

const DashboardLayout = () => {
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

const GuestRoute = () => {
  const isAuthenticated = localStorage.getItem("token");

  if (isAuthenticated) {
    const userRole = localStorage.getItem("role");
    // handle ketika role mengakses bukan page nya
    if (userRole === "admin") return <Navigate to="/admin" replace />;
    return (
      <Navigate to={userRole === "guru" ? "/guru" : "/MainPage"} replace />
    );
  }

  return <Outlet />;
};

const MuridRoute = () => {
  const isAuthenticated = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userRole === "guru") {
    return <Navigate to="/guru" replace />;
  }

  if (userRole === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

const TeacherRoute = () => {
  const isAuthenticated = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userRole === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (userRole !== "guru") {
    return <Navigate to="/MainPage" replace />;
  }

  return <Outlet />;
};

const AdminRoute = () => {
  const isAuthenticated = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (userRole !== "admin") {
    return <Navigate to="/MainPage" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public route */}
        <Route element={<GuestRoute />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/MainPage" replace />} />

          {/* murid akses route */}
          <Route element={<MuridRoute />}>
            <Route path="/MainPage" element={<MainPage />} />
            <Route path="/jadwal" element={<Jadwal />} />
            <Route path="/cari-kelas" element={<Kelas />} />
          </Route>

          {/* guru akses route */}
          <Route element={<TeacherRoute />}>
            <Route path="/guru" element={<DashboardPage />} />
            <Route
              path="/guru/ketersediaan-jadwal"
              element={<KetersediaanPage />}
            />
          </Route>

          {/* admin akses route */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/manajemen-murid" element={<ManajemenMurid />} />
            <Route path="/admin/manajemen-guru" element={<ManajemenGuru />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
