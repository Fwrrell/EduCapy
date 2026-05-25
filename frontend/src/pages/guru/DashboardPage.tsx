import { useEffect, useState } from "react";
import {
  GraduationCap,
  Timer,
  CalendarClock,
  BookOpen,
  CirclePlus,
  Users,
  CheckCircle2,
  BellRing,
} from "lucide-react";
export default function MainPages() {
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:3000/api/guru/dashboard",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
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
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // menggubah format sql YYYYMMDDTHH:MM:SS jadi DD MM YYYY
  const formatTanggal = (dateString: any) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  // biar ga blank page
  if (isLoading) {
    return (
      <div className="p-8 font-bold text-slate-500">
        Memuat data dashboard..
      </div>
    );
  }

  if (error) {
    return <div className="p-8 font-bold text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-10 p-10 w-full ">
        {/* card 1 welcome */}
        <div className="flex justify-between items-center bg-white border-[#DDE4E6] border rounded-2xl p-10">
          <div className="">
            <h1 className="text-[3.5rem] font-bold">
              Selamat Datang, Pak/Bu {`Budi`}!
            </h1>
            <p className="text-[1.5rem] font-normal">
              Semoga hari ini penuh dengan semangat belajar!{" "}
            </p>
          </div>
          <div className="">
            <button className="rounded-xl bg-[#406749] p-5 flex items-center gap-3 text-white capitalize font-bold cursor-pointer">
              <CirclePlus className="w-6 h-6 " />
              <span>Isi Jadwal Kesediaan</span>
            </button>
          </div>
        </div>
        {/* card 2 statistic */}
        <div className="flex gap-6 w-full justify-between items-center ">
          {/* total hours */}
          <div className="rounded-2xl border border-[#DDE4E6] flex-1 flex items-center p-8 gap-6 bg-white min-w-max">
            <div className="rounded-full p-3 bg-[#8FB996] shrink-0">
              <Timer className="w-8 h-8" color="#244A2F" />
            </div>
            <div className="flex flex-col ">
              <h4 className="uppercase font-semibold text-md tracking-wider whitespace-nowrap text-[#424942]">
                total jam mengajar
              </h4>
              <p className="flex items-baseline gap-2">
                <span className="font-extrabold text-3xl text-slate-800">
                  {dashboardData?.statistik.total_jam_mengajar}
                </span>
                <span className="font-medium text-lg text-slate-500">jam</span>
              </p>
            </div>
          </div>
          {/* banyak murid diajar */}
          <div className="rounded-2xl border border-[#DDE4E6] flex flex-1 items-center p-8 gap-6 bg-white min-w-max">
            <div className="rounded-full p-3 bg-[#8FB996] shrink-0">
              <Users className="w-8 h-8" color="#244A2F" />
            </div>
            <div className="flex flex-col">
              <h4 className="uppercase font-semibold text-md text-[#424942] tracking-wider whitespace-nowrap">
                jumlah murid aktif
              </h4>
              <p className="flex items-baseline gap-2">
                <span className="font-extrabold text-3xl text-slate-800">
                  {dashboardData?.statistik.jumlah_murid_aktif}
                </span>
                <span className="font-medium text-lg text-slate-500">
                  siswa
                </span>
              </p>
            </div>
          </div>
          {/* banyak kelas berlangsung */}
          <div className="rounded-2xl border border-[#DDE4E6] flex flex-1 items-center p-8 gap-6 bg-white min-w-max">
            <div className="rounded-full p-4 bg-[#8FB996] shrink-0">
              <BookOpen className="w-8 h-8" color="#244A2F" />
            </div>
            <div className="flex flex-col">
              <h4 className="uppercase font-semibold text-md text-[#424942] tracking-wider whitespace-nowrap">
                total sesi aktif
              </h4>
              <p className="flex items-baseline gap-2">
                <span className="font-extrabold text-3xl text-slate-800">
                  {dashboardData?.statistik.total_sesi_aktif}
                </span>
                <span className="font-medium text-lg text-slate-500">sesi</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-6 w-full items-stretch">
          {/* Jadwal Minggu ini */}
          <div className="flex flex-col flex-1 border border-[#DDE4E6] rounded-[24px] p-6 bg-white">
            {/* Header Kiri */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-slate-800">
                Jadwal Mengajar Minggu Ini
              </h3>
              <span className="text-[#406749] font-semibold text-sm cursor-pointer hover:underline">
                Lihat Semua
              </span>
            </div>

            {/* List Cards Jadwal */}
            <div className="flex flex-col gap-4">
              {dashboardData?.jadwal_minggu_ini?.length === 0 ? (
                <p className="text-slate-500 text-center py-4">
                  Tidak ada jadwal terdekat.
                </p>
              ) : (
                dashboardData?.jadwal_minggu_ini?.map((jadwal: any) => (
                  <div
                    key={jadwal.id_penditem}
                    className="border border-[#DDE4E6] flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm"
                  >
                    <div
                      className={`flex items-stretch gap-4 ${jadwal.status === "Selesai" ? "opacity-60" : ""}`}
                    >
                      <div
                        className={`w-1.5 rounded-full my-1 ${
                          jadwal.status === "Selesai"
                            ? "bg-slate-200"
                            : jadwal.status === "Mendatang"
                              ? "bg-slate-300"
                              : "bg-[#406749]"
                        }`}
                      ></div>

                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2 text-xs font-bold">
                          <div
                            className={`rounded-md px-2.5 py-1 ${
                              jadwal.status === "Selesai"
                                ? "bg-slate-100 text-slate-500"
                                : jadwal.status === "Mendatang"
                                  ? "bg-slate-200 text-slate-600"
                                  : "bg-[#C9EBCB] text-[#244A2F]"
                            }`}
                          >
                            {formatTanggal(jadwal.tanggal)}
                          </div>
                          <div
                            className={`rounded-md px-2.5 py-1 ${
                              jadwal.status === "Selesai"
                                ? "bg-slate-100 text-slate-500"
                                : jadwal.status === "Mendatang"
                                  ? "bg-slate-200 text-slate-600"
                                  : "bg-[#C9EBCB] text-[#244A2F]"
                            }`}
                          >
                            {jadwal.waktu}
                          </div>
                          <div
                            className={`rounded-md px-2.5 py-1 ${
                              jadwal.status === "Selesai"
                                ? "bg-slate-100 text-slate-500"
                                : "bg-[#C9EBCB] text-[#244A2F]"
                            }`}
                          >
                            {jadwal.mapel}
                          </div>
                        </div>
                        <h4
                          className={`font-bold capitalize text-lg ${
                            jadwal.status === "Selesai"
                              ? "text-slate-500"
                              : "text-slate-800"
                          }`}
                        >
                          {jadwal.murid}
                        </h4>
                        <p
                          className={`capitalize text-sm font-medium ${
                            jadwal.status === "Selesai"
                              ? "text-slate-400"
                              : "text-slate-500"
                          }`}
                        >
                          {jadwal.status === "Selesai"
                            ? "Selesai"
                            : jadwal.deskripsi_kelas}
                        </p>
                      </div>
                    </div>

                    {/* tombol berdasarkan status */}
                    {jadwal.status === "Selesai" ? (
                      <div className="flex items-center gap-1.5 text-[#8FB996] font-semibold text-sm pr-2">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Selesai</span>
                      </div>
                    ) : jadwal.status === "Mendatang" ? (
                      <button className="border border-slate-300 text-slate-600 bg-white rounded-lg capitalize px-5 py-2 font-semibold text-sm cursor-pointer hover:bg-slate-50 transition-colors">
                        Belum Waktunya
                      </button>
                    ) : (
                      <button className="bg-[#406749] text-white rounded-lg capitalize px-5 py-2 font-semibold text-sm cursor-pointer hover:bg-[#2d4a34] transition-colors">
                        Mulai Kelas
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
          {/* Section Permintaan Kelas */}
          <div className="flex flex-col bg-[#EBEEEF] rounded-[24px] p-6 w-full lg:w-[35%] shrink-0 relative min-h-[400px]">
            {/* Header Kanan */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-slate-800">
                <BellRing className="w-6 h-6 text-[#406749]" />
                <h3 className="font-bold text-xl">Permintaan Kelas</h3>
              </div>
              {/* notification component */}
              {dashboardData?.permintaan_kelas?.length > 0 && (
                <div className="bg-[#B3261E] text-white text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center shadow-sm">
                  {dashboardData?.permintaan_kelas.length}
                </div>
              )}
            </div>

            {/* list permintaan */}
            <div className="flex flex-col gap-4">
              {dashboardData?.permintaan_kelas?.length === 0 ? (
                <p className="text-slate-500 text-center py-4 text-sm font-medium">
                  Belum ada permintaan kelas baru.
                </p>
              ) : (
                dashboardData?.permintaan_kelas?.map((permintaan: any) => (
                  <div
                    key={permintaan.id_penditem}
                    className="bg-white rounded-xl p-4 border-l-[6px] border-[#8FB996] shadow-sm flex flex-col gap-1"
                  >
                    <span className="text-[#406749] text-xs font-bold">
                      {/* Menggabungkan function formatTanggal sama waktu dari API */}
                      {formatTanggal(permintaan.tanggal)}, {permintaan.waktu}
                    </span>
                    <h4 className="font-bold text-slate-800 text-lg">
                      {permintaan.murid}
                    </h4>
                    <p className="text-slate-500 text-sm font-medium">
                      {permintaan.deskripsi}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Footer link semua permintaan kelas */}
            <div className="mt-auto pt-8 flex justify-center">
              <span className="text-[#406749] font-semibold text-sm cursor-pointer hover:underline">
                Lihat Semua Permintaan
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
