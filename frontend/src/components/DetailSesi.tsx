import { X, CalendarDays, Clock, User, GraduationCap } from "lucide-react";
export default function DetailSesi({
  kelas,
  onClose,
}: {
  kelas: any;
  onClose: () => void;
}) {
  const formatTanggal = (tanggalString: string) => {
    if (!tanggalString) return "-";
    const date = new Date(tanggalString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };
  const generateList = (hari: string, start: string, end: string) => {
    const hariMap: Record<string, number> = {
      SENIN: 1,
      SELASA: 2,
      RABU: 3,
      KAMIS: 4,
      JUMAT: 5,
      SABTU: 6,
      MINGGU: 0,
    };
    const targetHari = hariMap[hari.toUpperCase()];
    const result = [];
    let d = new Date(start);

    while (d <= new Date(end)) {
      if (d.getDay() === targetHari) {
        result.push(
          new Date(d).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        );
      }
      d.setDate(d.getDate() + 1);
    }
    return result;
  };
  const listTanggal = generateList(
    kelas.hari_mengajar,
    kelas.tanggal_mulai,
    kelas.tanggal_selesai,
  );
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white flex flex-col min-w-2xl gap-10 p-6 rounded-2xl shadow-2xl w-96">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-xl capitalize">detail kelas</h3>
          <X onClick={onClose} className="w-7 h-7 font-bold" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2 ">
            <div className="flex items-center gap-4 text-[#406749]">
              <CalendarDays className="w-5 h-5" />
              <span className="font-semibold text-lg ">Rentang kelas</span>
            </div>
            <span className="font-semibold text-lg">
              {formatTanggal(kelas.tanggal_mulai)} -{" "}
              {formatTanggal(kelas.tanggal_selesai)}
            </span>
          </div>
          <div className="flex flex-col gap-2 ">
            <div className="flex items-center gap-4 text-[#406749]">
              <Clock className="w-5 h-5" />
              <span className="font-semibold text-lg capitalize">
                hari & jam
              </span>
            </div>
            <span className="font-semibold text-lg">
              {kelas.hari_mengajar}, {kelas.jam_mulai_les?.substring(0, 5)} -{" "}
              {kelas.jam_selesai_les?.substring(0, 5)}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4 text-[#406749]">
              <User className="w-5 h-5" />
              <span className="font-semibold text-lg capitalize">Pengajar</span>
            </div>
            <span className="font-semibold text-lg">{kelas.nama_guru}</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4 text-[#406749]">
              <GraduationCap className="w-5 h-5" />
              <span className="font-semibold text-lg capitalize">
                Tingkat pendidikan
              </span>
            </div>
            <span className="text-lg font-semibold">
              {kelas.mata_pelajaran} - {kelas.jenjang}
            </span>
          </div>
        </div>
        <div className="max-h-60 overflow-y-auto border-t pt-4">
          <p className="text-sm font-bold text-slate-500 mb-2">
            Daftar Tanggal Pertemuan:
          </p>
          <ul className="grid grid-cols-1 gap-2">
            {listTanggal.map((tgl, idx) => (
              <li
                key={idx}
                className="text-sm font-semibold p-2 rounded-lg border"
              >
                {tgl}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
