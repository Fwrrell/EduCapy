import {
  BookOpen,
  CalendarDays,
  ClockCheck,
  Flame,
  Clock,
  UserPlus,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:3000/api/admin/dashboard",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil data");
      }

      setDashboardData(result.data);
    } catch (err) {
      console.log("Error fetching data dashboard: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 font-bold text-slate-500">
        Memuat data dashboard..
      </div>
    );
  }

  console.log(dashboardData?.log_aktivitas);

  const logs = [
    ...(dashboardData?.log_aktivitas?.pendaftaran?.map((p: any) => ({
      tipe: "pendaftaran",
      pesan: `${p.nama_murid} mendaftar ${p.nama_mapel} bersama ${p.nama_guru}.`,
      waktu: p.created_at,
    })) || []),
    ...(dashboardData?.log_aktivitas?.guru_baru?.map((g: any) => ({
      tipe: "user_baru",
      pesan: `Guru baru: ${g.nama} dengan Email: ${g.email} berhasil terdaftar.`,
      waktu: g.created_at,
    })) || []),
    ...(dashboardData?.log_aktivitas?.murid_baru?.map((m: any) => ({
      tipe: "user_baru",
      pesan: `Murid baru: ${m.nama} dengan Email: ${m.email} berhasil terdaftar.`,
      waktu: m.created_at,
    })) || []),
  ].sort((a, b) => new Date(b.waktu).getTime() - new Date(a.waktu).getTime());

  return (
    <div className="p-8 mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Selamat datang kembali di dashboard admin. Pantau aktivitas terbaru
            disini.
          </p>
        </div>
      </div>
      {/* Main content */}
      <div className="flex flex-col gap-10 w-full">
        {/* card statistic */}
        <div className="flex gap-4 w-full justify-between items-center ">
          {/* sesi mendatang */}
          <div className="rounded-2xl border border-[#DDE4E6] flex-1 flex items-center p-4 gap-6 bg-white min-w-0">
            <div className="rounded-full p-4 bg-[#8FB996] shrink-0">
              <CalendarDays className="w-6 h-6" color="#244A2F" />
            </div>
            <div className="flex flex-col ">
              <h4 className="uppercase font-semibold text-md tracking-wider whitespace-nowrap text-[#424942]">
                Sesi Aktif
              </h4>
              <p className="flex items-baseline gap-2">
                <span className="font-extrabold text-2xl text-slate-800">
                  {dashboardData?.statistik.sesi_mendatang}
                </span>
                <span className="font-medium text-lg text-slate-500">sesi</span>
              </p>
            </div>
          </div>
          {/* sesi yang tersedia (kumpulan jam jam guru yang masih tersedia) */}
          <div className="rounded-2xl border border-[#DDE4E6] flex flex-1 items-center p-4 gap-6 bg-white min-w-max">
            <div className="rounded-full p-4 bg-[#8FB996] shrink-0">
              <ClockCheck className="w-6 h-6" color="#244A2F" />
            </div>
            <div className="flex flex-col">
              <h4 className="uppercase font-semibold text-md text-[#424942] tracking-wider whitespace-nowrap">
                Sesi Tersedia
              </h4>
              <p className="flex items-baseline gap-2">
                <span className="font-extrabold text-2xl text-slate-800">
                  {dashboardData?.statistik.jam_tersedia}
                </span>
                <span className="font-medium text-lg text-slate-500">jam</span>
              </p>
            </div>
          </div>
          {/* banyak pelajaran */}
          <div className="rounded-2xl border border-[#DDE4E6] flex flex-1 items-center p-4 gap-6 bg-white min-w-max">
            <div className="rounded-full p-4 bg-[#8FB996] shrink-0">
              <BookOpen className="w-6 h-6" color="#244A2F" />
            </div>
            <div className="flex flex-col">
              <h4 className="uppercase font-semibold text-md text-[#424942] tracking-wider whitespace-nowrap">
                Total Pelajaran
              </h4>
              <p className="flex items-baseline gap-2">
                <span className="font-extrabold text-2xl text-slate-800">
                  {dashboardData?.statistik.total_pelajaran}
                </span>
                <span className="font-medium text-lg text-slate-500">
                  Pelajaran
                </span>
              </p>
            </div>
          </div>
          {/* mapel paling banyak dipesan */}
          <div className="rounded-2xl border border-[#DDE4E6] flex flex-1 items-center p-4 gap-6 bg-white min-w-max">
            <div className="rounded-full p-4 bg-[#8FB996] shrink-0">
              <Flame className="w-6 h-6" color="#244A2F" />
            </div>
            <div className="flex flex-col">
              <h4 className="uppercase font-semibold text-md text-[#424942] tracking-wider whitespace-nowrap">
                MAPEL DIMINATI
              </h4>
              <p className="flex items-baseline gap-2">
                <span className="font-extrabold text-2xl text-slate-800">
                  {dashboardData?.statistik.mapel_terfavorit}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* log activity */}
        <div className="flex flex-col flex-1 border border-[#DDE4E6] rounded-[24px] p-6 bg-white h-full max-h-[600px]">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-slate-800">
              Log Aktivitas Terbaru
            </h3>
            <span
              onClick={fetchDashboard}
              className="text-[#406749] font-semibold text-sm cursor-pointer hover:underline"
            >
              Refresh
            </span>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            {logs.length === 0 ? (
              <p className="text-slate-400 text-center py-4 italic">
                Belum ada aktivitas tercatat.
              </p>
            ) : (
              logs.map((log: any, index: number) => {
                let iconBgColor = "";
                let IconComponent = null;
                let borderColor = "border-[#DDE4E6]";

                if (log.tipe === "pendaftaran") {
                  iconBgColor = "bg-[#C9EBCB] text-[#244A2F]";
                  IconComponent = <CheckCircle2 className="w-5 h-5" />;
                } else if (log.tipe === "batal") {
                  iconBgColor = "bg-red-100 text-red-600";
                  borderColor = "border-red-100 bg-red-50/30";
                  IconComponent = <XCircle className="w-5 h-5" />;
                } else if (log.tipe === "user_baru") {
                  iconBgColor = "bg-blue-100 text-blue-600";
                  IconComponent = <UserPlus className="w-5 h-5" />;
                }

                return (
                  <div
                    key={`${log.tipe}-${index}`}
                    className={`flex gap-4 items-start p-4 border ${borderColor} rounded-xl relative`}
                  >
                    {index !== logs.length - 1 && (
                      <div className="absolute left-[31px] top-[48px] bottom-[-16px] w-[2px] bg-slate-100 z-0"></div>
                    )}

                    <div
                      className={`p-2 rounded-full z-10 shrink-0 ${iconBgColor}`}
                    >
                      {IconComponent}
                    </div>

                    {/* Content log */}
                    <div className="flex flex-col w-full pt-0.5">
                      <p className="text-sm text-slate-700 leading-snug">
                        {log.pesan}
                      </p>

                      {/* Timestamp */}
                      <div className="flex items-center gap-1.5 mt-2 text-xs font-medium text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>
                          {new Date(log.waktu).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          -{" "}
                          {new Date(log.waktu).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
