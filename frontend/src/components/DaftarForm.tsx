import { useEffect, useState } from "react";
import { Star, X, ArrowRight } from "lucide-react";

interface FormDaftarProps {
  guru: any;
  onClose: () => void;
  onCariPengganti?: (
    dataUtama: any,
    sisaRentang: { mulai: string; selesai: string },
  ) => void;
}

export default function DaftarForm({ guru, onClose }: FormDaftarProps) {
  // State untuk form
  const [mapelTerpilih, setMapelTerpilih] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [hariTerpilih, setHaridipilih] = useState("");
  const [slotTerpilih, setSlotTerpilih] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // state apakah guru tersedia pada rentang waktu yang diinginkan murid
  const [intersection, setIntersection] = useState<
    "idle" | "full" | "partial" | "none"
  >("idle");
  // state tanggal efektif guru bisa mengajar berdasarkan rentang yang diberi murid
  const [tanggalEfektif, setTanggalEfektif] = useState({
    mulai: "",
    selesai: "",
  });
  // State untuk sisa tanggal yang tidak beririsan dengan kesediaan guru utama
  const [sisaKontrak, setSisaKontrak] = useState({ mulai: "", selesai: "" });
  const [listGuruPengganti, setGuruPengganti] = useState<any[]>([]);
  const [penggantiTerpilih, setPenggantiTerpilih] = useState<any>(null);
  // state jadwal kesediaan guru
  const [jadwal, setJadwal] = useState<any[]>([]);
  // state jadwal peserta mendaftar
  const [jadwalTerbooking, setJadwalTerbooking] = useState<any[]>([]);
  // fungsi toggle untuk menyimpan slot sesi tersedia yang dipilih murid
  const toggleSlotJam = (jamObj: any) => {
    setSlotTerpilih((prev) => {
      const isSelected = prev.some((p) => p.label === jamObj.label);
      if (isSelected) {
        return prev.filter((p) => p.label !== jamObj.label);
      } else {
        return [...prev, jamObj];
      }
    });
  };
  // fetch jadwal guru dan jadwal guru yang telah di book
  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const dataJadwalGuru = await fetch(
          `http://localhost:3000/api/murid/jadwal/${guru.id}`,
        );
        const data = await dataJadwalGuru.json();
        setJadwal(data.tersedia || []);
        setJadwalTerbooking(data.terbooking || []);
      } catch (error) {
        console.error("gagal fetch jadwal:", error);
      }
    };
    if (guru.id) {
      fetchJadwal();
    }
  }, [guru.id]);
  // periksa apakah jadwal guru sesuai dengan rentang jadwal yang dipilih murid
  useEffect(() => {
    if (!guru) return;

    if (!guru.tanggal_mulai_bersedia || !guru.tanggal_selesai_bersedia) {
      setIntersection("idle");
      return;
    }
    if (
      !tanggalMulai ||
      !tanggalSelesai ||
      !guru.tanggal_mulai_bersedia ||
      !guru.tanggal_selesai_bersedia
    ) {
      setIntersection("idle");
      return;
    }

    const toDateOnly = (dateString: string) => {
      const d = new Date(dateString);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    };
    // tanggal yang dipilih murid
    const S2 = toDateOnly(tanggalMulai);
    const E2 = toDateOnly(tanggalSelesai);
    const sortedJadwal = [...jadwal].sort(
      (a, b) =>
        new Date(a.tanggal_awal_bersedia).getTime() -
        new Date(b.tanggal_awal_bersedia).getTime(),
    );
    // periksa jika jadwal yang dipilih murid beririsan dengan 2 jadwal kesediaan berbeda
    let celah = false;
    if (jadwal && jadwal.length > 1) {
      for (let i = 0; i < sortedJadwal.length - 1; i++) {
        const endRow1 = toDateOnly(sortedJadwal[i].tanggal_akhir_bersedia);
        const startRow2 = toDateOnly(sortedJadwal[i + 1].tanggal_awal_bersedia);

        // Jika ada jeda lebih dari 1 hari, dianggap celah
        if (startRow2 > endRow1 + 24 * 60 * 60 * 1000) {
          // Cek apakah rentang murid beririsan dengan jeda jadwal kosong
          if (endRow1 < E2 && startRow2 > S2) {
            celah = true;
            break;
          }
        }
      }
    }
    // jika beririsan dengan 2 jadwal berbeda dari jadwal kesediaan guru yang sama maka tidak bisa book
    if (celah) {
      setIntersection("none");
      return;
    }
    // tanggal yang dipilih guru
    const S1 = toDateOnly(guru.tanggal_mulai_bersedia);
    const E1 = toDateOnly(guru.tanggal_selesai_bersedia);
    // jika tidak beririsan
    if (E2 < S1 || S2 > E1) {
      setIntersection("none");
    } else if (S2 >= S1 && E2 <= E1) {
      setIntersection("full");
    } else {
      setIntersection("partial");
      const formatLocal = (time: number) => {
        const d = new Date(time);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${y}-${m}-${day}`;
      };
      setTanggalEfektif({
        mulai: formatLocal(Math.max(S1, S2)),
        selesai: formatLocal(Math.min(E1, E2)),
      });
      // jika murid memilih tanggal awal lebih dulu dari tanggal awal kesediaan guru
      if (S2 < S1) {
        setSisaKontrak({
          mulai: formatLocal(S2),
          selesai: formatLocal(S1 - 86400000), // H-1 sebelum guru utama mulai
        });
      }
      // Jika murid memilih tanggal lebih dari kesediaan guru
      else if (E2 > E1) {
        setSisaKontrak({
          mulai: formatLocal(E1 + 86400000), // H+1 setelah guru utama selesai
          selesai: formatLocal(E2),
        });
      }
    }
  }, [tanggalMulai, tanggalSelesai, guru, jadwal]);
  // fetch data guru pengganti
  const fetchGuruPengganti = async () => {
    if (!mapelTerpilih || !hariTerpilih || slotTerpilih.length === 0) {
      alert(
        "Silakan pilih mata pelajaran, hari dan jam kelas terlebih dahulu sebelum mencari pengganti!",
      );
      return;
    }
    const sortedSlot = [...slotTerpilih].sort((a, b) =>
      a.jamMulaiSpesifik.localeCompare(b.jamMulaiSpesifik),
    );
    const jamM = sortedSlot[0].jamMulaiSpesifik;
    const jamS = sortedSlot[sortedSlot.length - 1].jamAkhirSpesifik;
    const url = `http://localhost:3000/api/murid/cari-pengganti?mapel=${encodeURIComponent(mapelTerpilih)}&hari=${hariTerpilih}&jamMulai=${jamM}&jamSelesai=${jamS}&mulai=${sisaKontrak.mulai}&selesai=${sisaKontrak.selesai}`;
    const response = await fetch(url);
    const data = await response.json();
    const uniqueTeachers = data.filter(
      (guru: any, index: number, self: any[]) =>
        index === self.findIndex((t) => t.id === guru.id),
    );

    setGuruPengganti(uniqueTeachers);
  };

  const hariTersedia = [
    ...new Set(jadwal.map((item) => item.hari_mengajar.toUpperCase())),
  ];
  const jamMap = new Map();
  jadwal
    .filter((item) => item.hari_mengajar.toUpperCase() === hariTerpilih)
    .forEach((item) => {
      const mulai = parseInt(item.jam_mulai.substring(0, 2), 10);
      const selesai = parseInt(item.jam_selesai.substring(0, 2), 10);
      for (let i = mulai; i < selesai; i++) {
        const jamMulai = `${i.toString().padStart(2, "0")}:00`;
        const jamAkhir = `${(i + 1).toString().padStart(2, "0")}:00`;
        const labelJam = `${jamMulai} - ${jamAkhir}`;
        const isBooked = jadwalTerbooking.some((booked) => {
          const isHariSama =
            booked?.hari_mengajar?.toUpperCase() === hariTerpilih;
          const isJamSama = booked?.jam_mulai_les?.substring(0, 5) === jamMulai;
          if (isHariSama && isJamSama && tanggalMulai && tanggalSelesai) {
            const formStart = new Date(tanggalMulai);
            const formEnd = new Date(tanggalSelesai);
            const dbStart = new Date(booked.tanggal_mulai);
            const dbEnd = new Date(booked.tanggal_selesai);

            const isTanggalOverlap = dbStart <= formEnd && dbEnd >= formStart;

            return isTanggalOverlap;
          }
          return isHariSama && isJamSama;
        });
        const isLewat = () => {
          if (
            new Date(tanggalMulai).toDateString() !== new Date().toDateString()
          )
            return false;
          const jamSekarang = new Date().getHours();
          return mulai < jamSekarang;
        };
        if (!isBooked && !jamMap.has(labelJam) && !isLewat()) {
          jamMap.set(labelJam, {
            id_jadwal: item.id_jadwal,
            label: `${jamMulai} - ${jamAkhir}`,
            jamMulaiSpesifik: jamMulai,
            jamAkhirSpesifik: jamAkhir,
          });
        }
      }
    });
  const jamTersedia = Array.from(jamMap.values());
  // Function suibmit pendaftaran les
  const handleSubmitBooking = async () => {
    if (
      !mapelTerpilih ||
      !tanggalMulai ||
      !tanggalSelesai ||
      !hariTerpilih ||
      slotTerpilih.length === 0
    ) {
      alert("Harap lengkapi semua pilihan (Mapel, Tanggal, Hari, dan Jam)!");
      return;
    }

    // validasi Tanggal
    if (new Date(tanggalMulai) > new Date(tanggalSelesai)) {
      alert("Tanggal mulai tidak boleh lebih dari tanggal selesai!");
      return;
    }
    const sortedSlot = [...slotTerpilih].sort((a, b) =>
      a.jamMulaiSpesifik.localeCompare(b.jamMulaiSpesifik),
    );

    const mergedSlots: any[] = [];
    for (const slot of sortedSlot) {
      if (mergedSlots.length === 0) {
        mergedSlots.push({ ...slot });
      } else {
        const lastSlot = mergedSlots[mergedSlots.length - 1];

        if (
          lastSlot.jamAkhirSpesifik === slot.jamMulaiSpesifik &&
          lastSlot.id_jadwal === slot.id_jadwal
        ) {
          lastSlot.jamAkhirSpesifik = slot.jamAkhirSpesifik;
        } else {
          mergedSlots.push({ ...slot });
        }
      }
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
          jadwal_list: mergedSlots,
          nama_mapel: mapelTerpilih,
          tanggal_mulai:
            intersection === "partial" ? tanggalEfektif.mulai : tanggalMulai,
          tanggal_selesai:
            intersection === "partial"
              ? tanggalEfektif.selesai
              : tanggalSelesai,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal melakukan booking");
      }
      if (intersection === "partial" && penggantiTerpilih) {
        if (!penggantiTerpilih.id_jadwal) {
          throw new Error(
            "Sistem Backend belum mengirimkan id_jadwal untuk guru pengganti ini.",
          );
        }

        const jadwalListPengganti = mergedSlots.map((slot) => ({
          ...slot,
          id_jadwal: penggantiTerpilih.id_jadwal,
        }));
        const resPengganti = await fetch(
          "http://localhost:3000/api/murid/booking",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              jadwal_list: jadwalListPengganti,
              nama_mapel: mapelTerpilih,
              tanggal_mulai: sisaKontrak.mulai,
              tanggal_selesai: sisaKontrak.selesai,
            }),
          },
        );
        if (!resPengganti.ok)
          throw new Error("Gagal mendaftarkan Guru Pengganti");
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
            {intersection === "none" && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl animate-in fade-in">
                <p className="text-red-600 text-sm font-bold text-center">
                  Guru tidak tersedia pada tanggal {tanggalMulai} sampai{" "}
                  {tanggalSelesai}.
                </p>
              </div>
            )}
            {intersection === "partial" && (
              <div className="flex flex-col gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl animate-in fade-in">
                <p className="text-yellow-800 text-sm font-bold text-center">
                  ⚠️ Guru hanya tersedia sebagian pada rentang waktu ini.
                  <br />
                  <span className="text-yellow-600 font-medium">
                    Efektif: {tanggalEfektif.mulai} s/d {tanggalEfektif.selesai}
                  </span>
                </p>
                <div className="flex gap-2 w-full mt-1">
                  <button
                    onClick={onClose}
                    className="flex-1 py-2 text-sm font-bold bg-white text-yellow-700 border border-yellow-300 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    Pilih Guru Lain
                  </button>
                  <button
                    onClick={() => {
                      fetchGuruPengganti();
                    }}
                    className="flex-1 py-2 text-sm font-bold bg-[#D4A373] text-white rounded-lg hover:bg-[#b0855b] transition-colors"
                  >
                    Tambah Pengganti
                  </button>
                </div>
              </div>
            )}
            {listGuruPengganti.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <p className="font-bold text-slate-700 mb-3">
                  Pilih Guru Pengganti:
                </p>
                <div className="space-y-3">
                  {listGuruPengganti.map((guru) => (
                    <div
                      key={guru.id}
                      className={`flex items-center justify-between p-3 border rounded-xl transition-all ${
                        penggantiTerpilih?.id === guru.id
                          ? "border-[#406749] bg-[#C9EBCB]/30"
                          : "border-slate-200 hover:border-[#406749]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                          {guru.nama.charAt(0)}
                        </div>
                        <span className="font-bold">{guru.nama}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (penggantiTerpilih?.id === guru.id) {
                            setPenggantiTerpilih(null);
                          } else {
                            setPenggantiTerpilih(guru);
                          }
                        }}
                        className={`text-sm font-bold px-4 py-1.5 rounded-lg ${
                          penggantiTerpilih?.id === guru.id
                            ? "bg-[#406749] text-white"
                            : "text-[#406749] bg-[#C9EBCB]/50"
                        }`}
                      >
                        {penggantiTerpilih?.id === guru.id
                          ? "Terpilih"
                          : "Pilih"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Step 3: Hari Belajar */}
            {intersection !== "none" && (
              <>
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {jamTersedia.map((jam, index) => {
                        const isSelected = slotTerpilih.some(
                          (s) => s.label === jam.label,
                        );

                        return (
                          <button
                            key={index}
                            onClick={() => toggleSlotJam(jam)}
                            className={`py-2 px-1 rounded-xl text-sm font-bold border transition-colors ${
                              isSelected
                                ? "bg-[#406749] border-[#406749] text-white"
                                : "bg-white border-slate-200 text-slate-600 hover:border-[#406749]"
                            }`}
                          >
                            {jam.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* FOOTER ACTION */}
          <div className="border-t border-dashed border-slate-300 pt-6 mt-2 flex flex-col gap-4 bg-white">
            <button
              onClick={handleSubmitBooking}
              disabled={isLoading || intersection === "none"}
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
