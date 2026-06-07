import {
  CalendarDays,
  Clock,
  CalendarSync,
  TriangleAlert,
  TrashIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
export default function RiwayatKelas() {
  const token = localStorage.getItem("token");
  const [riwayat, setRiwayat] = useState<any[]>([]);
  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/murid/riwayat-kelas",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        setRiwayat(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchJadwal();
  }, [token]);
  const formatTanggal = (tanggalString: string) => {
    if (!tanggalString) return "-";
    const date = new Date(tanggalString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };
  return (
    <>
      <div className="flex flex-col p-8">
        <div className="flex flex-col p-4">
          <h1 className="capitalize font-bold tracking-wide text-2xl">
            Daftar jadwal diambil
          </h1>
          <p>
            Berikut histori kelas yang pernah atau sedang anda ambil, jika ada
            konflik jadwal silahkan lakukan perubahan atau pembatalan.
          </p>
        </div>
        <div className="flex flex-col p-2 gap-2 w-full gap-3">
          {riwayat.length == 0 ? (
            <div className="p-4 text-center text-slate-500 font-bold">
              Belum ada riwayat kelas.
            </div>
          ) : (
            riwayat.map((kelas, index) => (
              <div
                key={index}
                className="flex flex-col bg-white border border-slate-200 shadow-sm rounded-xl mb-6 w-full"
              >
                <div className="flex flex-row p-6 items-start justify-between w-full">
                  <div className="flex flex-row items-center gap-4 min-w-[250px] w-1/3">
                    <div className="rounded-full w-16 h-16 bg-[#F4EFE6] shrink-0"></div>
                    <div className="flex flex-col items-start gap-1">
                      <span className="text-xl font-bold capitalize text-slate-800">
                        {kelas.nama_guru}
                      </span>
                      <span className="font-bold uppercase text-[0.7rem] bg-[#F8EED2] rounded-md px-3 py-1 text-[#8A6D3B] tracking-wider mt-1">
                        {kelas.mata_pelajaran} {kelas.jenjang}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-[auto_auto] gap-x-16 gap-y-6 flex-1">
                    <div className="flex flex-col gap-1.5 items-start">
                      <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                        <CalendarDays className="w-4 h-4" />
                        Rentang
                      </div>
                      <span className="font-semibold text-sm text-slate-800">
                        {formatTanggal(kelas.tanggal_mulai)} -{" "}
                        {formatTanggal(kelas.tanggal_selesai)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 items-start">
                      <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                        <Clock className="w-4 h-4" />
                        Hari & Jam
                      </div>
                      <span className="font-semibold text-sm text-slate-800 capitalize">
                        Setiap {kelas.hari_mengajar},{" "}
                        {kelas.jam_mulai_les?.substring(0, 5)} -{" "}
                        {kelas.jam_selesai_les?.substring(0, 5)}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5 items-start">
                      <div className="flex items-center gap-2 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                        <CalendarSync className="w-4 h-4" />
                        Total Sesi
                      </div>
                      <span className="capitalize font-bold text-sm text-slate-800">
                        {kelas.total_sesi} sesi terjadwal
                      </span>
                    </div>
                  </div>
                  <TrashIcon className="w-6 h-6 text-slate-400 font-normal" />
                </div>

                <div className="w-full h-px bg-slate-200"></div>

                <div className="flex justify-between items-center px-6 py-4">
                  <div className="flex items-center gap-2 bg-[#FDF0D5] text-[#9A7B38] px-4 py-2 rounded-full text-sm font-bold">
                    <TriangleAlert className="w-4 h-4" />2 Sesi Bentrok
                    (Dilewati)
                  </div>

                  <button className="text-[#2D6A4F] font-bold text-sm hover:underline hover:text-[#1e4a36] transition-colors cursor-pointer">
                    Lihat Detail Sesi
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
