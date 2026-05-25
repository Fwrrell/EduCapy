import { CalendarDays, Settings, School, LayoutDashboard } from "lucide-react";
import {
  FaListUl,
  FaRegCircleQuestion,
  FaRegSquareCaretLeft,
} from "react-icons/fa6";
import { useState } from "react";
import Logo from "../assets/logo-educapy 1.png";
import { NavLink } from "react-router-dom";
export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  //   const commonButtonClasses = `capitalize flex items-center gap-5 w-full text-xl font-medium px-3 py-3 text-[#4B5563] hover:bg-[#606C38]/20 hover:text-[#406749] rounded-xl transition-all duration-300 ${isExpanded ? "px-5 gap-5" : "justify-center"}`;
  const getButtonClass = (isActive: boolean) => {
    return `capitalize flex items-center gap-5 w-full text-xl font-medium px-3 py-3 text-[#4B5563] hover:bg-[#606C38]/20 hover:text-[#406749] rounded-xl transition-all duration-300 ${isExpanded ? "px-5 gap-5" : "justify-center px-0"}
     ${
       isActive
         ? "bg-[#606C38]/20 text-[#406749]"
         : "text-[#4B5563] hover:bg-[#606C38]/10 hover:text-[#406749]"
     }`;
  };
  return (
    <>
      <div
        className={`flex flex-col text-2xl h-screen p-10 border-r-4 transition-all duration-300 ${isExpanded ? "w-80 px-10" : "w-28 px-4"} relative`}
      >
        <button
          className="absolute -right-0 top-20 text-[#406749] hover:text-[#606C38] rounded-full z-50 shadow-sm cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <FaRegSquareCaretLeft
            className={`w-8 h-8 transition-transform duration-300 ${!isExpanded ? "rotate-180" : ""}`}
          />
        </button>
        <div
          className={`flex w-full items-center font-semibold gap-4 shadow-xs mb-10 ${isExpanded ? "" : "justify-center"}`}
        >
          <img
            src={Logo}
            alt="logo-educapy"
            className={`bg-white rounded-full p-3 shrink-0 object-cover transition-all duration-300 ${isExpanded ? "w-24 h-24 p-2" : "w-12 h-12 p-1"}`}
          />
          {isExpanded && <p className="text-[#406749] text-3xl">EduCapy</p>}
        </div>
        <div className="flex flex-col gap-8">
          {isExpanded && (
            <p className="capitalize text-[#4B5563]/50 tracking-[1.2px] text-[1.2rem] font-bold border-b-2 border-slate-200 pb-2 mb-2">
              menu utama
            </p>
          )}
          <NavLink
            to="/MainPage"
            className={({ isActive }) => getButtonClass(isActive)}
          >
            <LayoutDashboard className="w-7 h-7 min-w-[28px]" />
            {isExpanded && <span>halaman utama</span>}
          </NavLink>
          <NavLink
            to="/jadwal"
            className={({ isActive }) => getButtonClass(isActive)}
          >
            <CalendarDays className="w-7 h-7 min-w-[28px]" />
            {isExpanded && <span>jadwal</span>}
          </NavLink>
          <NavLink
            to="/kelas"
            className={({ isActive }) => getButtonClass(isActive)}
          >
            <School className="w-7 h-7 min-w-[28px]" />
            {isExpanded && <span>cari kelas</span>}
          </NavLink>
          <NavLink
            to="/daftar-booking"
            className={({ isActive }) => getButtonClass(isActive)}
          >
            <FaListUl className="w-7 h-7 min-w-[28px]" />
            {isExpanded && <span>daftar & booking</span>}
          </NavLink>
        </div>
        <div className="flex flex-col justify-evenly gap-10 mt-auto">
          <NavLink
            to="/pengaturan"
            className={({ isActive }) => getButtonClass(isActive)}
          >
            <Settings className="w-7 h-7 min-w-[28px]" />
            {isExpanded && <span>pengaturan</span>}
          </NavLink>

          <NavLink
            to="/bantuan"
            className={({ isActive }) => getButtonClass(isActive)}
          >
            <FaRegCircleQuestion className="w-7 h-7 min-w-[28px]" />
            {isExpanded && <span>bantuan</span>}
          </NavLink>
        </div>
      </div>
    </>
  );
}
