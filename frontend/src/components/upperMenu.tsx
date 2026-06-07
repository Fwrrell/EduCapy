import { Search, Bell, LogOut, PanelLeft } from "lucide-react";
import logo from "@/assets/logo-educapy 1.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNameFromToken, clearAuth } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface UpperMenuProps {
  onCloseSidebar: () => void;
}

export default function UpperMenu({ onCloseSidebar }: UpperMenuProps) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("Pengguna");

  useEffect(() => {
    const fullName = getNameFromToken();

    if (fullName) {
      const namaDepan = fullName.split(" ")[0];
      setFirstName(namaDepan);
    }
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <>
      <div className="flex top-0 z-50 items-center justify-between bg-[#F7F7F7] border-b-1 w-full p-2 transition-all duration-300">
        <div className="flex justify-center gap-3 sm:gap-4 items-center">
          <button
            onClick={onCloseSidebar}
            className="p-2 hover:bg-black/5 rounded-xl transition-colors cursor-pointer text-slate-700 hover:text-[#406749]"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
          <h3 className="font-bold text-md">EduCapy</h3>
        </div>
        <div className="flex items-center gap-2 sm:gap-5">
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group ml-1 sm:ml-2">
            <p className="font-medium text-sm sm:text-base text-slate-600 group-hover:text-slate-800 transition-colors hidden sm:block whitespace-nowrap">
              Halo, {firstName}
            </p>

            <Popover>
              <PopoverTrigger asChild>
                <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#406749]">
                  <img
                    src={logo}
                    alt={`Profil ${firstName}`}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-slate-100 shadow-sm hover:border-[#406749] transition-all cursor-pointer"
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-1 mt-1" align="end">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors outline-none cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
}
