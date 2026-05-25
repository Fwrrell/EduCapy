import { Timer, FileText, ArrowUpDown } from "lucide-react";
import { FaRegCircleDot } from "react-icons/fa6";
import { useState } from "react";
const jadwalData = [
  {
    id: 1,
    jam: "14:00",
    durasi: "90 min",
    status: "besok",
    judul: "Matematika - Kalkulus",
    tingkat: "SD - tingkat 5",
    dosen: "Dr. Drs. Ir. H. John Doe, S.E., S.H., M.T., M.Si., M.H., M.Pd.",
  },
  {
    id: 2,
    jam: "16:30",
    durasi: "60 min",
    status: "hari ini",
    judul: "Bahasa Indonesia - Sastra",
    tingkat: "SMP - tingkat 2",
    dosen: "Ibu Budiwati, S.S., M.Hum.",
  },
  {
    id: 3,
    jam: "14:00",
    durasi: "90 min",
    status: "selesai",
    judul: "Geologi - Struktur Tanah",
    tingkat: "SMP - tingkat 2",
    dosen: "Asep, S.Si",
  },
];
export default function Jadwal() {
  const [activeTab, setActiveTab] = useState("semua");
  const tabs = ["Semua", "akan datang", "selesai", "dibatalkan"];
  const filteredData = jadwalData.filter((item) => {
    if (activeTab === "Semua") return true;
    if (activeTab === "Akan Datang")
      return item.status === "besok" || item.status === "hari ini";
    if (activeTab === "Selesai") return item.status === "selesai";
    if (activeTab === "Dibatalkan") return item.status === "dibatalkan";
    return true;
  });
  return (
    <>
      <div className="flex flex-col p-12">
        <h1 className="capitalize text-4xl font-bold">kelas hari ini</h1>
        {/* current class card */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#606C38] to-[#283618] p-6 rounded-xl mt-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Timer className="w-7 h-7" color="#FFFF" />
              <p className="capitalize text-white font-semibold text-lg">
                akan dimulai dalam 45 menit
              </p>
            </div>
            <h3 className="text-white font-bold text-4xl">
              Matematika - Aljabar
            </h3>
            <h4 className="text-white text-lg">
              Dr. Drs. Ir. H. John Doe, S.E., S.H., M.T., M.Si., M.H., M.Pd.
            </h4>
          </div>
          {/* button material */}
          <button className="rounded-lg p-3 text-[#406749] font-semibold bg-white flex gap-3 cursor-pointer items-center">
            <FileText className="w-7 h-7" />
            <span className="text-xl">Materi Pertemuan</span>
          </button>
        </div>
        {/* filter */}
        <div className="flex items-center justify-between mt-10 mb-6">
          <div className="flex bg-slate-100 p-1.5 rounded-xl gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 
                    ${
                      activeTab === tab
                        ? "bg-white text-slate-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                    }`}
              >
                {tab}
                {tab === "Semua"
                  ? "(6)"
                  : tab === "Selesai"
                    ? "(0)"
                    : tab === "Dibatalkan"
                      ? "(4)"
                      : ""}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium text-md transition-colors">
            <ArrowUpDown className="w-4 h-4" />
            Sort by: Time
          </button>
        </div>
        {/* schedule list */}
        <div className="flex flex-1 flex-col items-center gap-3">
          {/* card 1 */}
          {filteredData.map((kelas) => (
            <div
              key={kelas.id}
              className="flex w-full items-center gap-4 rounded-xl shadow-md p-5"
            >
              <div className="flex flex-1 flex-col gap-1 p-4 border-r-4 border-slate-200">
                <span className="text-2xl font-bold">{kelas.jam}</span>
                <span className="text-[#9CA3AF]">{kelas.durasi}</span>
                <span className="flex items-center gap-2 rounded-xl bg-[#DCFCE7] p-1">
                  <FaRegCircleDot color="#22C55E" />
                  <span className="text-[#22C55E] font-semibold whitespace-nowrap">
                    {kelas.status}
                  </span>
                </span>
              </div>
              <div className="w-full flex-2 gap-3 flex flex-col">
                <div className="flex items-center gap-3">
                  <h3 className="capitalize font-bold text-4xl">
                    {kelas.judul}
                  </h3>
                  <span className="capitalize text-[#4B5563] rounded-lg bg-[#E5E7EB] p-2">
                    {kelas.tingkat}
                  </span>
                </div>
                <p className="text-lg ">{kelas.dosen}</p>
              </div>
              {kelas.status === "besok" && (
                <div className="flex gap-3 ml-auto">
                  <button className="font-bold text-[#406749] border-2 border-[#406749] rounded-xl px-4 py-2 hover:bg-slate-50">
                    Ubah Jadwal
                  </button>
                  <button className="font-bold text-white bg-red-500 rounded-xl px-4 py-2 hover:bg-red-600">
                    Batalkan
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
