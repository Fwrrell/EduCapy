import { useEffect, useState } from "react";
import { Star, X, ArrowRight } from "lucide-react";

interface FormDaftarProps {
  guru: any;
  onClose: () => void;
}

export default function DaftarForm({ guru, onClose }: FormDaftarProps) {
  // State untuk form
  const [mapelTerpilih, setMapelTerpilih] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [hariTerpilih, setHaridipilih] = useState("");
  const [jamTerpilih, setJamdipilih] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [jadwal, setJadwal] = useState<any[]>([]);

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const dataJadwalGuru = await fetch(
          `http://localhost:3000/api/murid/jadwal/${guru.id}`,
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

  // Function suibmit pendaftaran les
  const handleSubmitBooking = async () => {
    if (
      !mapelTerpilih ||
      !tanggalMulai ||
      !tanggalSelesai ||
      !hariTerpilih ||
      !jamTerpilih
    ) {
      alert("Harap lengkapi semua pilihan (Mapel, Tanggal, Hari, dan Jam)!");
      return;
    }

    // validasi Tanggal
    if (new Date(tanggalMulai) > new Date(tanggalSelesai)) {
      alert("Tanggal mulai tidak boleh lebih dari tanggal selesai!");
      return;
    }

    // cari id_jadwal berdasarkan hari dan jam yang dipilih user
    const selectedJadwal = jadwal.find((item) => {
      const jam = `${item.jam_mulai.substring(0, 5)}-${item.jam_selesai.substring(0, 5)}`;
      return (
        item.hari_mengajar.toUpperCase() === hariTerpilih && jam === jamTerpilih
      );
    });

    if (!selectedJadwal) {
      alert("Jadwal tidak valid!");
      return;
    }

    setIsLoading(true);

    try {
      // ambil token dari user tujuan nya biar tau user mana yang daftar
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/murid/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_jadwal: selectedJadwal.id_jadwal,
          nama_mapel: mapelTerpilih,
          tanggal_mulai: tanggalMulai,
          tanggal_selesai: tanggalSelesai,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal melakukan booking");
      }

      alert("Berhasil menyimpan ke daftar booking!");
      onClose(); // Tutup form popup
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50 flex justify-end">
        <div className="flex-1" onClick={onClose}></div>
        <div className="flex flex-col p-5 bg-white h-screen w-[450px] max-w-full animate-in slide-in-from-right duration-300 shadow-2xl">
          {/* HEADER CARD GURU */}
          <div className="flex items-center justify-between border-b-2 p-3 pb-6 border-[#C1C8BF]/30">
            <div className="flex gap-4 items-center">
              <div className="rounded-full bg-[#A67C52]/20 w-14 h-14 flex items-center justify-center font-bold text-[#A67C52] text-xl">
                {guru.nama ? guru.nama.charAt(0).toUpperCase() : "?"}
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xl font-bold tracking-wide text-slate-800">
                  {guru.nama}
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {guru.mata_pelajaran?.map((mapel: string, index: number) => (
                    <span
                      key={index}
                      className="rounded-lg bg-[#FEBF89]/40 px-2 py-1 text-xs font-semibold whitespace-nowrap text-[#A67C52]"
                    >
                      {mapel}
                    </span>
                  ))}
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-600 ml-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    4.9{" "}
                    <span className="font-normal text-slate-400">(124)</span>
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full shrink-0"
            >
              <X className="w-6 h-6 text-slate-400 hover:text-slate-600" />
            </button>
          </div>

          {/* FORM AREA */}
          <div className="flex flex-col flex-1 overflow-y-auto py-6 px-2 gap-7">
            {/* Step 1: Mapel */}
            <div className="flex flex-col gap-3">
              <label htmlFor="mapel" className="text-slate-600 font-bold">
                Step 1: Pilih Mata Pelajaran
              </label>
              <select
                name="mapel"
                id="mapel"
                value={mapelTerpilih}
                onChange={(e) => setMapelTerpilih(e.target.value)}
                className="capitalize text-md w-full p-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#406749] focus:border-[#406749]"
              >
                <option value="" disabled>
                  Pilih Mata Pelajaran
                </option>
                {guru.mata_pelajaran?.map((mapel: string, index: number) => (
                  <option key={index} value={mapel}>
                    {mapel}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Tanggal */}
            <div className="flex flex-col gap-3">
              <label className="text-slate-600 font-bold">
                Step 2: Tentukan Rentang Kontrak
              </label>
              <div className="flex items-center gap-3">
                <div className="flex flex-col w-full gap-1">
                  <span className="text-xs text-slate-500">Tanggal Mulai</span>
                  <input
                    type="date"
                    value={tanggalMulai}
                    onChange={(e) => setTanggalMulai(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-700 focus:outline-none focus:border-[#406749] focus:ring-1 focus:ring-[#406749]"
                  />
                </div>
                <div className="flex flex-col w-full gap-1">
                  <span className="text-xs text-slate-500">
                    Tanggal Selesai
                  </span>
                  <input
                    type="date"
                    value={tanggalSelesai}
                    onChange={(e) => setTanggalSelesai(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl bg-white text-slate-700 focus:outline-none focus:border-[#406749] focus:ring-1 focus:ring-[#406749]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Hari Belajar */}
            <div className="flex flex-col gap-3">
              <label className="text-slate-600 font-bold">
                Step 3: Pilih Hari Rutin Belajar
              </label>
              <div className="flex flex-wrap gap-2">
                {hariTersedia.map((hari) => (
                  <button
                    key={hari}
                    onClick={() => {
                      setHaridipilih(hari);
                      setJamdipilih(""); // Reset jam jika ganti hari
                    }}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
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

            {/* Step 4: Jam Les */}
            <div className="flex flex-col gap-3">
              <label className="text-slate-600 font-bold">
                Step 4: Pilih Waktu Belajar
                {hariTerpilih && (
                  <span className="text-[#406749]"> ({hariTerpilih})</span>
                )}
              </label>
              {!hariTerpilih ? (
                <p className="text-sm text-slate-400 italic">
                  Silakan pilih hari terlebih dahulu.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {jamTersedia.map((jam) => (
                    <button
                      key={jam}
                      onClick={() => setJamdipilih(jam)}
                      className={`py-2 px-1 rounded-xl text-sm font-bold border transition-colors ${
                        jam === jamTerpilih
                          ? "bg-[#406749] border-[#406749] text-white"
                          : "bg-white border-slate-200 text-slate-600 hover:border-[#406749]"
                      }`}
                    >
                      {jam}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* FOOTER ACTION */}
          <div className="border-t border-dashed border-slate-300 pt-6 mt-2 flex flex-col gap-4 bg-white">
            <button
              onClick={handleSubmitBooking}
              disabled={isLoading}
              className="w-full bg-[#406749] hover:bg-[#32523b] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? "Memproses..." : "Simpan ke Daftar Booking"}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
