import { Timer, FileText, ArrowUpDown } from "lucide-react";
import { FaRegCircleDot } from "react-icons/fa6";
import { useState, useEffect } from "react";
export default function Jadwal() {
  const token = localStorage.getItem("token");
  const [jadwal, setJadwal] = useState<any[]>([]);
  const getTanggalTerdekat = (
    hari: string,
    startDateStr: string,
    endDateStr: string,
    status: string,
  ) => {
    if (!startDateStr || !endDateStr) return "-";

    // Jika kelas sudah Selesai/Batal, tampilkan saja rentang masa kontraknya
    if (status === "Selesai" || status === "Dibatalkan") {
      const start = new Date(startDateStr).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
      });
      const end = new Date(endDateStr).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      return `${start} - ${end}`;
    }

    const hariMap: Record<string, number> = {
      MINGGU: 0,
      SENIN: 1,
      SELASA: 2,
      RABU: 3,
      KAMIS: 4,
      JUMAT: 5,
      SABTU: 6,
    };
    const targetHari = hariMap[hari.toUpperCase()];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    // Titik awal perhitungan: Hari ini ATAU tanggal mulai kontrak (pilih yang lebih baru)
    let baseDate = today > start ? new Date(today) : new Date(start);

    // menghitung jarak hari dari hari sekarang ke sesi berikutnya
    let currentHari = baseDate.getDay();
    let selisihHari = (targetHari + 7 - currentHari) % 7;

    const nextDate = new Date(baseDate);
    nextDate.setDate(baseDate.getDate() + selisihHari);

    // Jika tanggal terdekatnya ternyata sudah melewati masa kontrak
    if (nextDate > end) {
      return "Sesi Berakhir";
    }

    return nextDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
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
  const [activeTab, setActiveTab] = useState("Semua");
  const tabs = ["Semua", "Akan Datang", "Selesai", "Dibatalkan"];
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
  const getStatusStyle = (kelas: any) => {
    const status = kelas.status;
    if (status === "Mendatang") {
      const hariMap: Record<string, number> = {
        MINGGU: 0,
        SENIN: 1,
        SELASA: 2,
        RABU: 3,
        KAMIS: 4,
        JUMAT: 5,
        SABTU: 6,
      };
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const start = new Date(kelas.tanggal_mulai);
      start.setHours(0, 0, 0, 0);

      const end = new Date(kelas.tanggal_selesai);
      end.setHours(23, 59, 59, 999);

      const namaHariIni = hariMap[kelas.hari_mengajar?.toUpperCase()];

      const isHariIni = namaHariIni === today.getDay();
      const isDalamKontrak = today >= start && today <= end;

      if (isHariIni && isDalamKontrak) {
        // Tampilan jika hari ini
        return {
          bg: "bg-[#22C55E]",
          text: "text-white",
          dot: "#FFFFFF",
          label: "Hari ini",
          isCoret: false,
        };
      } else {
        return {
          bg: "bg-slate-100",
          text: "text-slate-500",
          dot: "#9CA3AF",
          label: "Akan datang",
          isCoret: false,
        };
      }
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
  // 1. Cari kelas hari ini
  const hariMap: Record<number, string> = {
    0: "MINGGU",
    1: "SENIN",
    2: "SELASA",
    3: "RABU",
    4: "KAMIS",
    5: "JUMAT",
    6: "SABTU",
  };

  const kelasHariIni = jadwal.find((kelas) => {
    if (kelas.status !== "Mendatang") return false;

    const hariMap: Record<number, string> = {
      0: "MINGGU",
      1: "SENIN",
      2: "SELASA",
      3: "RABU",
      4: "KAMIS",
      5: "JUMAT",
      6: "SABTU",
    };
    const namaHariIni = hariMap[new Date().getDay()];
    const isHariSama = kelas.hari_mengajar?.toUpperCase() === namaHariIni;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(kelas.tanggal_mulai);
    start.setHours(0, 0, 0, 0);

    const end = new Date(kelas.tanggal_selesai);
    end.setHours(23, 59, 59, 999);

    const isDalamKontrak = today >= start && today <= end;

    return isHariSama && isDalamKontrak;
  });
  return (
    <>
      <div className="flex flex-col p-12">
        {kelasHariIni ? (
          <div className="flex items-center justify-between bg-gradient-to-r from-[#606C38] to-[#283618] p-6 rounded-xl mt-2">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Timer className="w-7 h-7" color="#FFFF" />
                <p className="capitalize text-white font-semibold text-lg">
                  Dimulai pukul {kelasHariIni.jam_mulai_les.substring(0, 5)}
                </p>
              </div>
              <h3 className="text-white font-bold text-4xl">
                {kelasHariIni.nama_mapel}
              </h3>
              <h4 className="text-white text-lg">{kelasHariIni.nama_guru}</h4>
            </div>

            <button className="rounded-lg p-3 text-[#406749] font-semibold bg-white flex gap-3 items-center">
              <FileText className="w-7 h-7" />
              <span className="text-xl">Materi Pertemuan</span>
            </button>
          </div>
        ) : (
          // Tampilan tidak ada kelas
          <div className="bg-slate-200 p-6 rounded-xl mt-2 text-slate-600 text-lg text-center">
            Tidak ada kelas hari ini. Selamat beristirahat!
          </div>
        )}
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
            const style = getStatusStyle(kelas);
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
                      kelas.jam_selesai_les,
                    )}
                  </span>
                  <div className="flex flex-col mt-1">
                    <span className="text-slate-600 font-semibold capitalize">
                      {kelas.hari_mengajar}
                    </span>
                    <span className="text-sm font-bold text-[#406749]">
                      {getTanggalTerdekat(
                        kelas.hari_mengajar,
                        kelas.tanggal_mulai,
                        kelas.tanggal_selesai,
                        kelas.status,
                      )}
                    </span>
                  </div>
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
                  <p className="text-lg font-semibold capitalize">
                    {kelas.nama_guru}
                  </p>
                </div>
                {kelas.status === "Dibatalkan" && (
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
