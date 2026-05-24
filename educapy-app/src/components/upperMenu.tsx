import { Search, Bell, LogOut } from "lucide-react";
import logo from "../assets/logo-educapy 1.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function upperMenu() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("Pengguna");

  useEffect(() => {
    const fullName = localStorage.getItem("userName");

    if (fullName) {
      const namaDepan = fullName.split(" ")[0];
      setFirstName(namaDepan);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    navigate("/login");
  };
  return (
    <>
      <div className="flex top-0 items-center justify-between bg-[#DFDFDF] w-full p-5">
        <h3 className="font-bold text-[1.4rem] ">EduCapy</h3>
        <div className="flex items-center gap-5">
          <Search className="w-8 h-8" color="#9CA3AF" />
          <Bell className="w-8 h-8" color="#9CA3AF" />
          <div className="flex items-center gap-3 cursor-pointer group">
            <p className="font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
              Halo, {firstName}
            </p>

            <img
              src={logo}
              alt="Profil Budi"
              className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 shadow-sm"
            />
            <button
              onClick={handleLogout}
              className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Keluar"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
