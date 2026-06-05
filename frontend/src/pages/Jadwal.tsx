import { Timer, FileText, ArrowUpDown } from "lucide-react";
import { FaRegCircleDot } from "react-icons/fa6";
import { useState, useEffect } from "react";
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
  const token = localStorage.getItem("token");
  const [jadwal, setJadwal] = useState<any[]>([]);
  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/murid/jadwalku",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        setJadwal(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchJadwal();
  }, []);
  const hitungDurasiMenit = (start: string, end: string) => {
    if (!start || !end) return "0 MIN";
    const [jamMulai, menitMulai] = start.split(":").map(Number);
    const [jamSelesai, menitSelesai] = end.split(":").map(Number);

    const totalMenitMulai = jamMulai * 60 + menitMulai;
    const totalMenitSelesai = jamSelesai * 60 + menitSelesai;

    return `${totalMenitSelesai - totalMenitMulai} MIN`;
  };
  const [activeTab, setActiveTab] = useState("semua");
  const tabs = ["Semua", "Akan datang", "Selesai", "Dibatalkan"];
  const filteredData = jadwal.filter((kelas) => {
    if (activeTab === "Semua") return true;
    if (activeTab === "Akan Datang") return kelas.status === "Mendatang";
    if (activeTab === "Selesai") return kelas.status === "Selesai";
    if (activeTab === "Dibatalkan") return kelas.status === "Batal";
    return true;
  });
  const getTabCount = (namaTab: string) => {
    if (namaTab === "Semua") {
      return jadwal.length;
    }
    if (namaTab === "Akan Datang") {
      return jadwal.filter((kelas) => kelas.status === "Mendatang").length;
    }
    if (namaTab === "Selesai") {
      return jadwal.filter((kelas) => kelas.status === "Selesai").length;
    }
    if (namaTab === "Dibatalkan") {
      return jadwal.filter((kelas) => kelas.status === "Batal").length;
    }
    return 0;
  };
  const getStatusStyle = (status: string) => {
    if (status === "Mendatang") {
      return {
        text: "text-[#D1D5DB]",
        dot: "#22C55E",
        label: "Akan datang",
        isCoret: false,
      };
    }
    if (status === "Batal") {
      return {
        bg: "bg-[#EF4444]",
        text: "text-[#FFFF]",
        dot: "text-[#FFFF]",
        label: "Dibatalkan",
        isCoret: true,
      };
    }
    if (status === "Selesai") {
      return {
        bg: "bg-[#F3F4F6]",
        text: "text-[#6B7280]",
        label: "Selesai",
        dot: "text-[#9CA3AF]",
        isCoret: false,
      };
    }
    return {
      bg: "bg-slate-100",
      text: "text-slate-500",
      dot: "#9CA3AF",
      label: status,
      isCoret: false,
    };
  };
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
                {tab} ({getTabCount(tab)})
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
          {filteredData.map((kelas, index) => {
            const style = getStatusStyle(kelas.status);
            return (
              <div
                key={index}
                className="flex w-full items-center gap-4 rounded-xl shadow-md p-5"
              >
                <div className="flex flex-1 flex-col gap-1 p-4 border-r-4 border-slate-200">
                  <span
                    className={`text-3xl font-bold tracking-tight ${style.isCoret ? "text-slate-400 line-through decoration-4" : "text-slate-700"}`}
                  >
                    {kelas.jam_mulai_les?.substring(0, 5)}
                  </span>
                  <span className="text-[#9CA3AF]">
                    {hitungDurasiMenit(
                      kelas.jam_mulai_les,
                      kelas.jam_akhir_les,
                    )}
                  </span>
                  <span
                    className={`flex items-center gap-2 rounded-xl ${style.bg} px-2 py-1.5 w-fit mt-2`}
                  >
                    <FaRegCircleDot color={style.dot} />
                    <span
                      className={`${style.text} font-semibold text-sm whitespace-nowrap`}
                    >
                      {style.label}
                    </span>
                  </span>
                </div>
                <div className="w-full flex-2 gap-3 flex flex-col">
                  <div className="flex items-center gap-3">
                    <h3
                      className={`text-3xl font-bold tracking-tight ${style.isCoret ? "text-slate-400 line-through decoration-4" : "text-slate-700"}`}
                    >
                      {kelas.nama_mapel}
                    </h3>
                    <span className="capitalize text-[#4B5563] rounded-lg bg-[#E5E7EB] p-2">
                      {kelas.jenjang}-{kelas.tingkat}
                    </span>
                  </div>
                  <p className="text-lg ">{kelas.nama_guru}</p>
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
            );
          })}
        </div>
      </div>
    </>
  );
}
