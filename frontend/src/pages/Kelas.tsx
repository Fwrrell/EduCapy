import { useEffect, useState, useMemo } from "react";
import {
  ChevronRight,
  ChevronLeft,
  ListFilter,
  Star,
  MoveRight,
  Calendar,
} from "lucide-react";
import FormDaftar from "@/components/DaftarForm";
const dayNames = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];
export default function Kelas() {
  const [daftarGuru, setDaftarGuru] = useState<any[]>([]);
  const [guruTerpilih, setGuruTerpilih] = useState<any | null>(null);

  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  // generate seminggu kedepan
  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      return {
        id: i,
        name: dayNames[date.getDay()],
        date: date.getDate(),
        fullDate: date,
      };
    });
  }, [currentDate]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isThisWeek = days.some(
    (d: any) => d.fullDate.getTime() === today.getTime(),
  );
  useEffect(() => {
    const fetchGuru = async () => {
      try {
        const formatDate = (dateObj: Date) => {
          const y = dateObj.getFullYear();
          const m = String(dateObj.getMonth() + 1).padStart(2, "0");
          const d = String(dateObj.getDate()).padStart(2, "0");
          return `${y}-${m}-${d}`;
        };
        const startDate = formatDate(days[0].fullDate);
        const endDate = formatDate(days[6].fullDate);
        let url = `http://localhost:3000/api/murid/cari-guru?start=${startDate}&end=${endDate}`;

        const listGuru = await fetch(url);
        const data = await listGuru.json();
        const formatData = data.map((guru: any) => ({
          ...guru,
          mata_pelajaran: guru.matapelajaran
            ? guru.matapelajaran.split(", ")
            : [],
        }));
        setDaftarGuru(formatData);
      } catch (error) {
        console.error("gagal fetch data guru:", error);
      }
    };
    fetchGuru();
  }, [days]);

  const nextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 7);
    setCurrentDate(next);
  };

  const prevWeek = () => {
    if (isThisWeek) return;
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 7);
    setCurrentDate(prev);
  };

  const monthYearStr = currentDate.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
  const dateRangeStr = `${currentDate.getDate()} - ${days[6].fullDate.getDate()}`;

  return (
    <>
      <div className="flex flex-col p-8 gap-6">
        <div className="flex justify-between items-center">
          <h1 className="capitalize font-bold text-3xl tracking-wider">
            cari guru
          </h1>
          <div className="flex items-center gap-3">
            <div className="rounded-lg flex items-center shadow-sm border border-slate-200 bg-white">
              <div className="pl-4 pr-2 py-2">
                <span className="capitalize font-semibold text-[#374151] text-sm">
                  {monthYearStr}, {dateRangeStr}
                </span>
              </div>

              {/* Input stqart tanggal untuk mingguan */}
              <div className="relative flex items-center justify-center w-8 h-8 mr-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer group">
                <Calendar className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />

                <input
                  type="date"
                  value={currentDate.toISOString().split("T")[0]}
                  onChange={(e) => {
                    const d = new Date(e.target.value);
                    if (!isNaN(d.getTime())) {
                      d.setHours(0, 0, 0, 0);
                      setCurrentDate(d);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Pilih Tanggal"
                />
              </div>

              {/* Button next/prev mingguan */}
              <button
                onClick={prevWeek}
                disabled={isThisWeek}
                className="p-2 hover:bg-slate-50 border-l border-slate-200 transition-colors cursor-pointer"
              >
                <ChevronLeft color="#9CA3AF" className="w-4 h-4" />
              </button>
              <button
                onClick={nextWeek}
                className="p-2 hover:bg-slate-50 border-l border-slate-200 transition-colors cursor-pointer"
              >
                <ChevronRight color="#9CA3AF" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 ">
          {daftarGuru.map((guru) => (
            <div
              key={guru.id}
              className="rounded-xl p-5 gap-6 bg-[#FFFF] flex flex-col max-w-xl shadow-md"
            >
              <div className="flex items-center justify-evenly gap-8">
                <div className="rounded-full bg-[#A67C52]/10 w-12 h-12"></div>
                <span className="font-normal text-2xl tracking-wide">
                  {guru.nama}
                </span>
                <span className="flex items-center gap-2">
                  <Star color="#FFD700" />
                  <p className="text-[#374151] font-bold text-lg">4.9</p>
                </span>
              </div>
              {/* subject */}
              <div className="flex items-center gap-4 p-3 border-b-2 border-[#C1C8BF]/30">
                {guru.mata_pelajaran.map((mapel: string, index: number) => (
                  <div
                    key={index}
                    className="rounded-xl bg-[#C6E8C8]/30 text-[#406749] text-sm p-2 font-semibold capitalize"
                  >
                    {mapel}
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="rounded-full w-3 h-3 bg-[#22C55E]"></div>
                  <span className="capitalize text-[#424942] font-normal text-sm tracking-wide">
                    tersedia hari ini
                  </span>
                </div>
                <button
                  className="p-2 capitalize text-sm flex items-center gap-2 font-bold text-[#406749]"
                  onClick={() => setGuruTerpilih(guru)}
                >
                  lihat jadwal & book
                  <MoveRight color="#406749" className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {guruTerpilih && (
        <FormDaftar guru={guruTerpilih} onClose={() => setGuruTerpilih(null)} />
      )}
    </>
  );
}
