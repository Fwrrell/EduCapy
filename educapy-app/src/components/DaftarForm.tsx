import { useEffect, useState } from "react";
import { Star, X, TriangleAlert, ArrowRight } from "lucide-react";
interface FormDaftarProps {
  guru: any;
  onClose: () => void;
}
export default function DaftarForm({ guru, onClose }: FormDaftarProps) {
  const [hariTerpilih, setHaridipilih] = useState("");
  const [jamTerpilih, setJamdipilih] = useState("");

  const [jadwal, setJadwal] = useState<any[]>([]);
  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const dataJadwalGuru = await fetch(
          `http://localhost:5000/api/jadwal/${guru.id}`,
        );
        const data = await dataJadwalGuru.json();
        setJadwal(data);
      } catch (error) {
        console.error("gagal fetch jadwal:", error);
      }
    };
    if (guru.id) {
      fetchJadwal();
    }
  }, [guru.id]);
  const hariTersedia = [
    ...new Set(jadwal.map((item) => item.hari_mengajar.toUpperCase())),
  ];
  const jamTersedia = jadwal
    .filter((item) => item.hari_mengajar.toUpperCase() === hariTerpilih)
    .map((item) => {
      const mulai = item.jam_mulai.substring(0, 5);
      const selesai = item.jam_selesai.substring(0, 5);
      return `${mulai}-${selesai}`;
    });
  const guruInitial = guru.nama ? guru.nama.charAt(0).toUpperCase() : "?";
  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
        <div className="flex-1" onClick={onClose}></div>
        <div className="flex flex-col p-5 bg-white h-screen max-w-[500px] animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-evenly border-b-2 p-3 border-[#C1C8BF]/30">
            <div className="rounded-full bg-[#A67C52]/10 w-14 h-14"></div>
            <div className="flex flex-col gap-3">
              <span className="text-xl font-bold tracking-wide">
                {guru.nama}
              </span>
              <div className="flex items-center gap-4">
                {guru.mata_pelajaran.map((mapel: string, index: number) => (
                  <span
                    key={index}
                    className="rounded-lg bg-[#FEBF89] p-1 text-sm font-semibold whitespace-nowrap text-[#794C20]"
                  >
                    {mapel}
                  </span>
                ))}
                <span className="flex items-center gap-1 text-sm font-bold text-slate-700">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  4.9 <span className="font-normal text-slate-500">(124)</span>
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full"
            >
              <X className="w-6 h-6 text-slate-600" />
            </button>
          </div>

          <div className="flex flex-col flex-1 overflow-y-auto p-6 gap-5">
            <label
              htmlFor="mapel"
              className="capitalize text-[#424942] text-lg font-medium"
            >
              pilih mata pelajaran
            </label>
            <select
              name="mapel"
              id="mapel"
              className="capitalize text-lg w-full mt-1 p-3 border-2 border-[#8FB996]/30 rounded-lg bg-white"
            >
              <option value="" disabled selected>
                Pilih Mata Pelajaran
              </option>
              {guru.mata_pelajaran.map((mapel: string, index: number) => (
                <option key={index} value={mapel}>
                  {mapel}
                </option>
              ))}
            </select>
            <span className="text-lg font-semibold capitalize text-[#424942]">
              tentukan rentang tanggal
            </span>
            <div className="flex items-center gap-3">
              <input
                type="date"
                name="tanggal"
                id="tanggal_booking"
                className="w-full mt-2 p-3 border-2 border-[#8FB996]/30 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-[#406749] focus:ring-1 focus:ring-[#406749]"
              />
              <input
                type="date"
                name="tanggal"
                id="tanggal_booking"
                className="w-full mt-2 p-3 border-2 border-[#8FB996]/30 rounded-lg bg-white text-slate-700 focus:outline-none focus:border-[#406749] focus:ring-1 focus:ring-[#406749]"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-slate-600 font-medium">
                Step 3: Pilih Hari Belajar
              </label>
              <div className="flex flex-wrap gap-3">
                {hariTersedia.map((hari) => (
                  <button
                    key={hari}
                    onClick={() => setHaridipilih(hari)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${
                      hari === hariTerpilih
                        ? "bg-[#406749] border-[#406749] text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:border-[#406749]"
                    }`}
                  >
                    {hari}
                  </button>
                ))}
              </div>
            </div>
            {/* jam les */}
            <div className="flex flex-col gap-3">
              <label className="text-slate-600 font-medium">
                Step 4: Pilih Jam di Hari
                {hariTerpilih && (
                  <span className="text-[#406749]"> {hariTerpilih}</span>
                )}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {jamTersedia.map((jam) => (
                  <button
                    key={jam}
                    onClick={() => setJamdipilih(jam)}
                    disabled={jam === "16:00 - 17:00"}
                    className={`py-2 px-1 rounded-lg text-sm font-bold border transition-colors ${
                      jam === jamTerpilih
                        ? "bg-[#406749] border-[#406749] text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:border-[#406749]"
                    }`}
                  >
                    {jam}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-[#FFF8E7] border border-[#FDE1A9] rounded-xl p-4 flex flex-col gap-3">
              <div className="flex gap-3">
                <TriangleAlert className="w-6 h-6 text-[#A67C52] shrink-0" />
                <p className="text-slate-700 text-md leading-relaxed">
                  Total 12 Pertemuan. Guru tidak tersedia pada tanggal{" "}
                  <span className="font-bold">15 Juni</span> &{" "}
                  <span className="font-bold">6 Juli</span>.
                </p>
              </div>
              <div className="flex gap-4 ml-9">
                <button className="text-sm font-bold text-[#406749] hover:underline">
                  Cari Guru Pengganti
                </button>
                <button className="text-sm font-bold text-[#A67C52] hover:underline">
                  Lewati Sesi Bentrok
                </button>
              </div>
            </div>
            <div className="border-t border-dashed border-[#C1C8BF] p-6 flex flex-col gap-4 bg-white">
              <div className="bg-[#FAF9F7] rounded-xl p-4 flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-sm">
                    Total Pertemuan Terjadwal
                  </span>
                  <span className="text-xl font-extrabold text-slate-800">
                    12 Pertemuan
                  </span>
                </div>
                <span className="text-[#406749] text-sm">10 Efektif</span>
              </div>
              <button className="w-full bg-[#406749] hover:bg-[#32523b] text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                Simpan ke Daftar Booking
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
