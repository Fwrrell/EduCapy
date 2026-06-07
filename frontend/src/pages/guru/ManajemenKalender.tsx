import { Calendar, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback, useMemo } from "react";

// tinggi per blok jam untuk mempermudah perhitungan
const HOUR_HEIGHT = 160;
const START_HOUR = 8;

const hours = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

const dayNames = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

export default function ManajemenKalender() {
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [now, setNow] = useState(new Date());
  const [agenda, setAgenda] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // update bar indikator jam
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // generate seminggu kedepan
  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      const isToday = now.toDateString() === date.toDateString();
      return {
        id: i,
        name: dayNames[date.getDay()],
        date: date.getDate(),
        fullDate: date,
        isToday,
      };
    });
  }, [currentDate, now]);

  const fetchAgenda = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token tidak ditemukan");

      const endDate = new Date(currentDate);
      endDate.setDate(currentDate.getDate() + 6);

      const formatDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
      };

      const startDateStr = formatDate(currentDate);
      const endDateStr = formatDate(endDate);

      const response = await fetch(
        `http://localhost:3000/api/guru/kalender?start_date=${startDateStr}&end_date=${endDateStr}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      console.log(result);

      if (!response.ok)
        throw new Error(result.message || "Gagal mengambil data kalender");

      setAgenda(result.data || {});
    } catch (err: any) {
      console.error("Fetch Events Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchAgenda();
  }, [fetchAgenda]);

  const nextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 7);
    setCurrentDate(next);
  };

  const prevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(currentDate.getDate() - 7);
    setCurrentDate(prev);
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h + m / 60;
  };

  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimePosition =
    (currentHour + currentMinute / 60 - START_HOUR) * HOUR_HEIGHT;
  const isThisWeek = days.some(
    (d: any) => d.fullDate.toDateString() === now.toDateString(),
  );

  const monthYearStr = currentDate.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
  const dateRangeStr = `${currentDate.getDate()} - ${days[6].fullDate.getDate()}`;

  return (
    <div className="p-8 mx-auto space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Manajemen Kalender
          </h1>
          <p className="text-muted-foreground mt-1">
            Lihat dan kelola jadwal mengajar Anda minggu ini.
          </p>
        </div>
        {/* Tooltip range tanggal kalender */}
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

      {/* Kalender */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex border-b border-slate-200 bg-white">
          <div className="w-20 flex-none py-4 text-center text-xs font-medium text-slate-400 border-r border-slate-200">
            WIB
          </div>
          <div className="flex-1 grid grid-cols-7">
            {days.map((day: any) => (
              <div
                key={day.id}
                className={`py-4 text-center border-r border-slate-200 last:border-r-0 ${
                  day.isToday ? "bg-green-50/50" : ""
                }`}
              >
                <div
                  className={`text-[10px] uppercase tracking-wider font-bold ${day.isToday ? "text-green-600" : "text-slate-400"}`}
                >
                  {day.name}
                </div>
                <div
                  className={`text-lg font-bold ${day.isToday ? "text-green-700" : "text-slate-700"}`}
                >
                  {day.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content kalender*/}
        <div className="flex flex-1 overflow-y-auto min-h-[700px] relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center backdrop-blur-[1px]">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          )}

          {/* waktu */}
          <div className="w-20 flex-none border-r border-slate-200 bg-white">
            {hours.map((hour) => (
              <div
                key={hour}
                className="text-center text-xs font-medium text-slate-400 border-b border-slate-100"
                style={{ height: `${HOUR_HEIGHT}px` }}
              >
                <div className="relative -top-3 bg-white inline-block px-1 mt-4">
                  {hour}
                </div>
              </div>
            ))}
          </div>

          {/* grid kalender */}
          <div className="flex-1 grid grid-cols-7 relative">
            <div className="absolute inset-0 pointer-events-none">
              {hours.map((_, i) => (
                <div
                  key={i}
                  className="border-b border-slate-100"
                  style={{ height: `${HOUR_HEIGHT}px` }}
                />
              ))}
            </div>

            {/* indikator jam */}
            {isThisWeek &&
              currentHour >= START_HOUR &&
              currentHour < START_HOUR + hours.length && (
                <div
                  className="absolute left-0 right-0 border-t-2 border-blue-500 z-20 pointer-events-none flex items-center"
                  style={{ top: `${currentTimePosition}px` }}
                >
                  <div className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded ml-2 relative -top-[11px]">
                    {currentHour.toString().padStart(2, "0")}:
                    {currentMinute.toString().padStart(2, "0")}
                  </div>
                </div>
              )}

            {/* agenda */}
            {days.map((day) => (
              <div
                key={day.id}
                className={`relative border-r border-slate-100 last:border-r-0 ${
                  day.isToday ? "bg-green-50/10" : ""
                }`}
              >
                {/* cek agenda yagn coock sama range mingguan nya */}
                {agenda?.[day.name]?.map((event: any) => {
                  const startPos = formatTime(event.jam_mulai);
                  const endPos = formatTime(event.jam_selesai);
                  const duration = endPos - startPos;

                  // validasi kalo agenda nya udah lewat jam sekarang
                  const [endH, endM] = event.jam_selesai.split(":").map(Number);
                  const eventEndTime = new Date(day.fullDate);
                  eventEndTime.setHours(endH, endM, 0, 0);
                  const isPassed = now > eventEndTime;

                  return (
                    <div
                      key={event.id_penditem}
                      className={`absolute inset-x-2 border rounded-xl p-3 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] flex flex-col gap-1 z-10 hover:shadow-md transition-all cursor-pointer ${
                        isPassed
                          ? "bg-green-50 border-green-200"
                          : "bg-white border-slate-200"
                      }`}
                      style={{
                        top: `${(startPos - START_HOUR) * HOUR_HEIGHT}px`,
                        height: `${duration * HOUR_HEIGHT - 8}px`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isPassed
                              ? "text-green-600 bg-green-100"
                              : "text-blue-600 bg-blue-50"
                          }`}
                        >
                          {isPassed ? "Selesai" : event.status}
                        </span>
                      </div>
                      <h3
                        className={`font-bold text-sm leading-tight mt-1 ${
                          isPassed ? "text-green-900" : "text-slate-800"
                        }`}
                      >
                        {event.mapel}
                      </h3>
                      <p
                        className={`text-xs font-medium leading-tight ${
                          isPassed ? "text-green-700" : "text-green-700"
                        }`}
                      >
                        {event.murid}
                      </p>
                      <p
                        className={`text-[11px] mt-1 ${
                          isPassed ? "text-green-600/70" : "text-slate-500"
                        }`}
                      >
                        {event.jam_mulai} - {event.jam_selesai}
                      </p>

                      <button
                        className={`mt-auto w-full py-1.5 border border-dashed rounded-md text-[10px] font-bold transition-colors ${
                          isPassed
                            ? "border-green-300 text-green-600 hover:bg-green-100"
                            : "border-slate-300 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                        }`}
                      >
                        {isPassed ? "SELESAI" : "LIHAT DETAIL"}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
