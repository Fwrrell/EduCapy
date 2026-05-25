import { useEffect, useState } from "react";
import {
  ChevronRight,
  ChevronLeft,
  ListFilter,
  Star,
  MoveRight,
} from "lucide-react";
import FormDaftar from "../components/DaftarForm";
export default function Kelas() {
  const [daftarGuru, setDaftarGuru] = useState<any[]>([]);
  useEffect(() => {
    const fetchGuru = async () => {
      try {
        const listGuru = await fetch("http://localhost:5000/api/guru");
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
  }, []);
  const [guruTerpilih, setGuruTerpilih] = useState<any | null>(null);
  return (
    <>
      <div className="flex flex-col p-8 gap-6">
        <div className="flex justify-between items-center">
          <h1 className="capitalize font-bold text-3xl tracking-wider">
            cari guru
          </h1>
          <div className="flex items-center gap-3">
            <div className="rounded-lg flex items-center gap-2 shadow-sm">
              {/* date */}
              <span className="capitalize font-semibold text-[#374151] text-normal p-4">
                mei 7-13, 2026
              </span>
              <ChevronLeft color="#9CA3AF" />
              <ChevronRight color="#9CA3AF" />
            </div>
            <button className="flex items-center p-4 shadow-sm gap-3 rounded-lg">
              <ListFilter color="#1E1E18" className="w-5 h-5" />
              <span className="font-bold text-xl">Filter </span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {daftarGuru.map((guru) => (
            <div
              key={guru.id}
              className="rounded-xl p-5 gap-6 bg-[#FFFF] flex flex-col max-w-xl"
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
                    className="rounded-xl bg-[#C6E8C8]/30 text-[#406749] p-2 font-semibold capitalize"
                  >
                    {mapel}
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="rounded-full w-3 h-3 bg-[#22C55E]"></div>
                  <span className="capitalize text-[#424942] font-normal tracking-wide">
                    tersedia hari ini
                  </span>
                </div>
                <button
                  className="p-2 capitalize text-lg flex items-center gap-2 font-bold text-[#406749]"
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
