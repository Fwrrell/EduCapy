import {
  CalendarDays,
  Settings,
  School,
  LayoutDashboard,
  CalendarCheck,
  Compass,
  Users,
} from "lucide-react";
import {
  FaListUl,
  FaRegCircleQuestion,
  FaRegSquareCaretLeft,
} from "react-icons/fa6";
import { useState, type ElementType } from "react";
import Logo from "@/assets/logo-educapy 1.png";
import { NavLink } from "react-router-dom";
import { getRoleFromToken } from "@/lib/utils";

type MenuItem = {
  name: string;
  path: string;
  icon: ElementType;
  badge?: number;
};

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  // ambil role dari payload token
  const userRole = getRoleFromToken() || "murid";

  const getButtonClass = (isActive: boolean) => {
    return `capitalize flex items-center gap-5 w-full text-xl font-medium px-3 py-3 rounded-xl transition-all duration-300 ${
      isExpanded ? "px-5 gap-5" : "justify-center px-0"
    } ${
      isActive
        ? "bg-[#606C38]/20 text-[#406749]"
        : "text-[#4B5563] hover:bg-[#606C38]/10 hover:text-[#406749]"
    }`;
  };

  // --- KONFIGURASI MENU MURID ---
  const menuMurid: MenuItem[] = [
    { name: "halaman utama", path: "/MainPage", icon: LayoutDashboard },
    { name: "jadwalku", path: "/jadwal", icon: CalendarDays },
    { name: "cari kelas", path: "/cari-kelas", icon: Compass },
    {
      name: "riwayat kelas",
      path: "/riwayat-kelas",
      icon: FaListUl,
      badge: 2,
    },
  ];

  // --- KONFIGURASI MENU GURU ---
  const menuGuru: MenuItem[] = [
    { name: "halaman utama", path: "/guru", icon: LayoutDashboard },
    {
      name: "ketersediaan jadwal",
      path: "/guru/ketersediaan-jadwal",
      icon: CalendarCheck,
    },
    {
      name: "manajemen kalender",
      path: "/guru/manajemen-kalender",
      icon: CalendarDays,
    },
    {
      name: "daftar booking",
      path: "/guru/daftar-booking",
      icon: FaListUl,
      badge: 2,
    },
  ];

  const menuAdmin: MenuItem[] = [
    { name: "Manajemen Murid", path: "/admin/manajemen-murid", icon: Users },
    { name: "Manajemen Guru", path: "/admin/manajemen-guru", icon: Users },
  ];

  // Menu dirender berdasarkan role yang dilocalstorage
  let currentMenu: MenuItem[];
  if (userRole === "murid") {
    currentMenu = menuMurid;
  } else if (userRole === "guru") {
    currentMenu = menuGuru;
  } else {
    currentMenu = menuAdmin;
  }

  return (
    <>
      <div
        className={`flex flex-col items-center h-screen py-10 border-r-4 transition-all duration-300 ${
          isExpanded ? "w-70 px-8" : "w-25 px-4"
        } relative`}
      >
        <div className="flex items-center">
          {/* HEADER SIDEBAR */}
          <div
            className={`flex w-full items-center font-semibold gap-4 shadow-xs mb-5 ${
              isExpanded ? "" : "justify-center"
            }`}
          >
            <img
              src={Logo}
              alt="logo-educapy"
              className={`bg-white rounded-full shrink-0 object-cover transition-all duration-300 ${
                isExpanded ? "w-20 h-20 p-2" : "w-12 h-12 p-1"
              }`}
            />
            {isExpanded && (
              <div className="flex flex-col justify-center">
                <p className="text-[#406749] text-2xl font-bold leading-none">
                  EduCapy
                </p>
                {/* sub-title khusus untuk role guru */}
                {userRole === "guru" && (
                  <p className="text-[#4B5563]/60 text-[0.75rem] font-bold tracking-[1.5px] mt-1 uppercase">
                    Portal Guru
                  </p>
                )}
              </div>
            )}
            <button
              className="text-[#406749] hover:text-[#606C38] rounded-full z-50 shadow-sm cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <FaRegSquareCaretLeft
                className={`w-6 h-6 transition-transform duration-300 ${
                  !isExpanded ? "rotate-180 w-3 h-3" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* MENU UTAMA */}
        <div
          className={`flex flex-col ${isExpanded ? "gap-6 w-full" : "gap-8 max-w-15"}`}
        >
          {isExpanded && (
            <p className="capitalize text-[#4B5563]/50 tracking-[1.2px] text-lg font-bold border-b-2 border-slate-200 pb-2 mb-2">
              menu utama
            </p>
          )}

          {currentMenu.map((item, index) => {
            const IconComponent = item.icon;

            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) => getButtonClass(isActive)}
              >
                <div className="flex items-center gap-4 flex-1 relative">
                  <IconComponent className="w-6 h-6 min-w-[25px]" />
                  {isExpanded && (
                    <span className="text-lg whitespace-nowrap">
                      {item.name}
                    </span>
                  )}

                  {/* badge notif */}
                  {item.badge && isExpanded && (
                    <div className=" right-0 bg-[#4B5563] text-white text-xs font-bold w-4 h-4 p-3 rounded-full flex items-center justify-center">
                      {item.badge}
                    </div>
                  )}
                </div>
              </NavLink>
            );
          })}
        </div>

        {/* MENU BOTTOM (PENGATURAN & BANTUAN) */}
        <div
          className={`flex flex-col justify-evenly w-full mt-auto ${isExpanded ? "gap-6" : "gap-4"}`}
        >
          <NavLink
            to={userRole === "guru" ? "/guru/pengaturan" : "/pengaturan"}
            className={({ isActive }) => getButtonClass(isActive)}
          >
            <Settings className="w-6 h-6 min-w-[25px]" />
            {isExpanded && <span className="text-lg">pengaturan</span>}
          </NavLink>

          <NavLink
            to={userRole === "guru" ? "/guru/bantuan" : "/bantuan"}
            className={({ isActive }) => getButtonClass(isActive)}
          >
            <FaRegCircleQuestion className="w-6 h-6 min-w-[25px]" />
            {isExpanded && <span className="text-lg">bantuan</span>}
          </NavLink>
        </div>
      </div>
    </>
  );
}
