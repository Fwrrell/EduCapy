import { GraduationCap, Timer, CalendarClock, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { getNameFromToken } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
export default function MainPages() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("Pengguna");

  useEffect(() => {
    const fullName = getNameFromToken();

    if (fullName) {
      const namaDepan = fullName.split(" ")[0];
      setFirstName(namaDepan);
    }
  }, []);
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
    if (token) {
      fetchJadwal();
    }
  }, [token]);
  const urutanHari: { [key: string]: number } = {
    SENIN: 1,
    SELASA: 2,
    RABU: 3,
    KAMIS: 4,
    JUMAT: 5,
    SABTU: 6,
    MINGGU: 7,
  };

  const jadwalTerurut = [...jadwal].sort((a, b) => {
    const hariA = (a.hari_mengajar || "").toUpperCase();
    const hariB = (b.hari_mengajar || "").toUpperCase();
    return urutanHari[hariA] - urutanHari[hariB];
  });
  const kelasAktif = jadwalTerurut.filter((kelas) => {
    const hariIni = new Date();
    hariIni.setHours(0, 0, 0, 0);

    const tujuhHariKedepan = new Date();
    tujuhHariKedepan.setDate(hariIni.getDate() + 7);
    tujuhHariKedepan.setHours(23, 59, 59, 999);

    const tglMulai = new Date(kelas.tanggal_mulai);
    const tglSelesai = new Date(kelas.tanggal_selesai);

    // LOGIKA:
    // 1. Kelas tidak batal
    // 2. Kontrak kelas belum berakhir (tanggal_selesai >= hari ini)
    // 3. Tanggal mulai kontrak tidak lebih dari 7 hari ke depan
    return (
      kelas.status !== "Batal" &&
      tglSelesai >= hariIni &&
      tglMulai <= tujuhHariKedepan
    );
  });
  return (
    <>
      <div className="flex flex-col gap-10 p-10 w-full max-w-full overflow-x-hidden">
        {/* card 1 welcome */}
        <div className="flex justify-between items-center bg-white rounded-2xl shadow-md p-10">
          <div className="">
            <h1 className="text-4xl font-bold">Selamat Datang, {firstName}!</h1>
            <p className="text-2xl font-normal">Mau belajar apa hari ini?</p>
          </div>
          <div className="">
            <button
              onClick={() => navigate("/cari-kelas")}
              className="rounded-xl bg-[#406749] p-5 flex items-center gap-3 text-white capitalize font-bold cursor-pointer"
            >
              <GraduationCap className="w-6 h-6 " />
              <span>daftar kelas baru</span>
            </button>
          </div>
        </div>
        {/* card 2 statistic */}
        <div className="flex gap-6 xl:flex-wrap max-w-full justify-between items-center">
          {/* total hours */}
          <div className="rounded-2xl shadow-md flex-1 flex items-center p-5 gap-6 bg-white ">
            <div className="rounded-full p-3 bg-[#8FB996] shrink-0">
              <Timer className="w-8 h-8" color="#244A2F" />
            </div>
            <div className="flex flex-col ">
              <h4 className="uppercase font-semibold text-md tracking-wider whitespace-nowrap text-[#424942]">
                total jam belajar
              </h4>
              <p className="flex items-baseline gap-2">
                <span className="font-extrabold md:text-2xl xl:text-3xl text-slate-800">
                  42.5
                </span>
                <span className="font-medium text-lg text-slate-500">jam</span>
              </p>
            </div>
          </div>
          <div className="rounded-2xl shadow-md flex flex-1 items-center p-5 gap-6 bg-white ">
            <div className="rounded-full p-3 bg-[#FEBF89] shrink-0">
              <CalendarClock className="w-8 h-8" color="#794C20" />
            </div>
            <div className="flex flex-col">
              <h4 className="uppercase font-semibold text-md text-[#424942] tracking-wider whitespace-nowrap">
                sesi mendatang
              </h4>
              <p className="flex items-baseline gap-2">
                <span className="font-extrabold text-3xl text-slate-800">
                  3
                </span>
                <span className="font-medium text-lg text-slate-500">sesi</span>
              </p>
            </div>
          </div>
          <div className="rounded-2xl shadow-md flex flex-1 items-center p-5 gap-6 bg-white ">
            <div className="rounded-full p-4 bg-[#CBAD3C] shrink-0">
              <BookOpen className="w-8 h-8" color="#504100" />
            </div>
            <div className="flex flex-col">
              <h4 className="uppercase font-semibold text-md text-[#424942] tracking-wider whitespace-nowrap">
                banyak kelas diambil
              </h4>
              <p className="flex items-baseline gap-2">
                <span className="font-extrabold text-3xl text-slate-800">
                  3
                </span>
                <span className="font-medium text-lg text-slate-500">
                  mata pelajaran
                </span>
              </p>
            </div>
          </div>
        </div>
        {/* card 3 schedule */}
        <div className="flex flex-col gap-4 ">
          {/* header */}
          <div className="flex justify-between items-center p-8 bg-white shadow-md rounded-3xl">
            <h3 className="capitalize text-lg font-semibold">
              jadwal belajar minggu ini
            </h3>
            <button className="text-[#406749] capitalize font-normal cursor-pointer">
              lihat semua
            </button>
          </div>
          {/* card list */}
          {kelasAktif.length > 0 ? (
            kelasAktif.map((kelas, index) => (
              <div
                key={index}
                className="border border-[#DDE4E6] flex justify-between items-center bg-white p-10 rounded-2xl"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="bg-[#8FB996] text-[#244A2F] font-semibold rounded-xl p-2">
                      {kelas.jam_mulai_les.substring(0, 5)} -{" "}
                      {kelas.jam_selesai_les.substring(0, 5)}
                    </div>
                    <div className="bg-[#C9EBCB] text-[#04210D] font-semibold rounded-xl p-2">
                      {kelas.nama_mapel}
                    </div>
                  </div>
                  <h4 className="font-bold capitalize text-2xl">
                    {kelas.nama_guru}
                  </h4>
                  <p className="capitalize font-semibold">
                    {kelas.jenjang} {kelas.tingkat} • {kelas.nama_mapel}
                  </p>
                </div>
                <span className="bg-[#406749] text-white rounded-2xl capitalize p-4 font-semibold cursor-pointer">
                  {kelas.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-400 p-10">
              Tidak ada kelas aktif saat ini.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
