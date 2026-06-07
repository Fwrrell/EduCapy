import {
  CalendarDays,
  Settings,
  School,
  LayoutDashboard,
  CalendarCheck,
  Compass,
  Users,
  Book,
} from "lucide-react";
import {
  FaListUl,
  FaRegCircleQuestion,
  FaRegSquareCaretLeft,
} from "react-icons/fa6";
import { type ElementType } from "react";
import Logo from "@/assets/logo-educapy 1.png";
import { NavLink } from "react-router-dom";
import { getRoleFromToken } from "@/lib/utils";

type MenuItem = {
  name: string;
  path: string;
  icon: ElementType;
  badge?: number;
};

interface SidebarProps {
  isExpanded: boolean;
}

export default function Sidebar({ isExpanded }: SidebarProps) {
  // ambil role dari payload token
  const userRole = getRoleFromToken() || "murid";

  // --- KONFIGURASI MENU MURID ---
  const menuMurid: MenuItem[] = [
    { name: "halaman utama", path: "/MainPage", icon: LayoutDashboard },
    { name: "jadwalku", path: "/jadwal", icon: CalendarDays },
    { name: "cari kelas", path: "/cari-kelas", icon: Compass },
    {
      name: "riwayat kelas",
      path: "/riwayat-kelas",
      icon: FaListUl,
      // badge: 2,
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

  // --- KONFIGURASI MENU ADMIN ---
  const menuAdmin: MenuItem[] = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Manajemen Murid", path: "/admin/manajemen-murid", icon: Users },
    { name: "Manajemen Guru", path: "/admin/manajemen-guru", icon: Users },
    {
      name: "Manajemen Pelajaran",
      path: "/admin/manajemen-pelajaran",
      icon: Book,
    },
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

  const getButtonClass = (isActive: boolean) => {
    return `w-full transition-all duration-300 rounded-xl ${
      isExpanded ? "px-2 py-3" : "py-3 flex justify-center"
    } ${
      isActive
        ? "bg-[#606C38]/20 text-[#406749]"
        : "text-[#4B5563] hover:bg-[#606C38]/10 hover:text-[#406749]"
    }`;
  };

  return (
    <>
      <div
        className={`flex flex-col items-center h-screen py-2 border-r-1 transition-all duration-300 bg-[#F7F7F7] overflow-hidden ${
          isExpanded ? "w-64 px-4" : "w-0 px-0 border-r-0"
        } relative`}
      >
        <div className="flex items-center w-full">
          {/* HEADER SIDEBAR */}
          <div
            className={`flex w-full items-center font-semibold gap-4 mb-5 ${
              isExpanded ? "" : "justify-center"
            }`}
          >
            <img
              src={Logo}
              alt="logo-educapy"
              className={`bg-white rounded-full shrink-0 object-cover transition-all duration-300 ${
                isExpanded ? "w-16 h-16 p-2" : "w-0 h-0 p-0 opacity-0"
              }`}
            />
            {isExpanded && (
              <div className="flex flex-col justify-center whitespace-nowrap">
                <p className="text-[#406749] text-2xl font-bold leading-none">
                  EduCapy
                </p>
                {/* sub-title khusus untuk role guru */}
                {userRole === "guru" && (
                  <p className="text-[#4B5563]/60 text-[0.75rem] font-bold tracking-[1.5px] mt-1 uppercase">
                    Portal Guru
                  </p>
                )}
                {/* sub-title khusus untuk role guru */}
                {userRole === "admin" && (
                  <p className="text-[#4B5563]/60 text-[0.75rem] font-bold tracking-[1.5px] mt-1 uppercase">
                    Portal Admin
                  </p>
                )}
              </div>
            )}
            {/* <button
              className="text-[#406749] hover:text-[#606C38] rounded-full z-50 shadow-sm cursor-pointer"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <FaRegSquareCaretLeft
                className={`w-6 h-6 transition-transform duration-300 ${
                  !isExpanded ? "rotate-180 w-3 h-3" : ""
                }`}
              />
            </button> */}
          </div>
        </div>

        {/* MENU UTAMA */}
        <div
          className={`flex flex-col w-full ${isExpanded ? "gap-2" : "gap-8 max-w-15"}`}
        >
          {isExpanded && (
            <p className="capitalize text-[#4B5563]/50 tracking-[1.2px] text-sm font-bold border-b-2 border-slate-100 pb-2 mb-2 mt-2">
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
                  <IconComponent className="w-5 h-5 min-w-[25px]" />
                  {isExpanded && (
                    <span className="text-base font-semibold capitalize whitespace-nowrap">
                      {item.name}
                    </span>
                  )}

                  {/* badge notif */}
                  {item.badge && isExpanded && (
                    <div className="absolute right-0 bg-[#4B5563] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
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
          className={`flex flex-col justify-evenly w-full mt-auto ${isExpanded ? "gap-2" : "gap-4"}`}
        >
          <NavLink
            to={userRole === "guru" ? "/guru/pengaturan" : "/pengaturan"}
            className={({ isActive }) => getButtonClass(isActive)}
          >
            <div className="flex items-center gap-4 flex-1 relative">
              <Settings className="w-6 h-6 min-w-[25px]" />
              {isExpanded && (
                <span className="text-base font-semibold capitalize whitespace-nowrap">
                  pengaturan
                </span>
              )}
            </div>
          </NavLink>

          <NavLink
            to={userRole === "guru" ? "/guru/bantuan" : "/bantuan"}
            className={({ isActive }) => getButtonClass(isActive)}
          >
            <div className="flex items-center gap-4 flex-1 relative">
              <FaRegCircleQuestion className="w-6 h-6 min-w-[25px]" />
              {isExpanded && (
                <span className="text-base font-semibold capitalize whitespace-nowrap">
                  bantuan
                </span>
              )}
            </div>
          </NavLink>
        </div>
      </div>
    </>
  );
}
