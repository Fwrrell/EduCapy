import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Loader2,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  ListFilter,
} from "lucide-react";

export default function DaftarBooking() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  // Fungsi untuk mengambil data booking dari API
  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/guru/riwayat-sesi?limit=1000&search=${searchQuery}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const result = await response.json();

      if (!response.ok)
        throw new Error(result.message || "Gagal mengambil data");

      setBookings(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Handler untuk mengubah status booking (Selesai/Batal)
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    const confirmMsg =
      newStatus === "Selesai"
        ? "Tandai sesi ini sebagai selesai?"
        : "Apakah Anda yakin ingin membatalkan sesi ini?";

    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/guru/sesi/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      fetchBookings();
    } catch (err: any) {
      alert("Gagal memperbarui status: " + err.message);
    }
  };

  // Filter data di client untuk status (karena API riwayat-sesi belum ada filter status)
  const filteredBookings = bookings.filter(
    (b) => statusFilter === "Semua" || b.status === statusFilter,
  );

  const formatTanggal = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="p-8 mx-auto space-y-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Daftar Booking
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola permintaan kelas dan pantau riwayat sesi belajar murid Anda.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-bold">
          ⚠️ {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search bar */}
        <div className="relative w-full md:max-w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari nama murid atau mata pelajaran"
            className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700 font-medium text-sm shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter bar */}
        <div className="w-full md:w-auto">
          <div className="flex items-center gap-2 px-4 bg-slate-50 border border-slate-200 rounded-xl w-full md:w-auto focus-within:border-slate-300 focus-within:bg-slate-100 transition-colors shadow-sm">
            <ListFilter className="h-4 w-4 text-slate-500 shrink-0" />
            <select
              className="bg-transparent text-slate-700 text-sm font-bold py-2.5 outline-none cursor-pointer w-full md:w-auto pr-2 appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Semua">Semua Status</option>
              <option value="Mendatang">Mendatang</option>
              <option value="Selesai">Selesai</option>
              <option value="Batal">Batal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap min-w-[250px]">
                  Murid & Pelajaran
                </th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap min-w-[200px]">
                  Waktu & Jadwal
                </th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[2px] whitespace-nowrap min-w-[150px]">
                  Status
                </th>
                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[2px] text-right whitespace-nowrap min-w-[120px]">
                  Aksi
                </th>
              </tr>
            </thead>
            {/* Tabel COntent */}
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-10 w-10 animate-spin text-[#406749]" />
                      <span className="text-slate-400 font-bold tracking-wide">
                        Loading data booking...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-8 py-20 text-center text-slate-400 font-bold text-lg"
                  >
                    Data booking tidak ditemukan.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id_penditem}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full  bg-[#F4EFE6] flex items-center justify-center text-[#8A6D3B] font-black text-xl shrink-0">
                          {booking.nama_murid.charAt(0)}
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-slate-800 text-lg">
                            {booking.nama_murid}
                          </span>
                          <span className="text-[10px] font-black text-[#406749] uppercase tracking-wider bg-[#C9EBCB] px-2.5 py-1 rounded-lg w-fit">
                            {booking.nama_mapel}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-slate-700">
                          <Clock className="w-4 h-4 text-[#8FB996]" />
                          <span className="font-bold text-sm">
                            {formatTanggal(booking.tanggal_sesi)}
                          </span>
                        </div>
                        <div className="text-xs font-extrabold bg-slate-100 text-slate-500 px-3 py-1.5 rounded-xl w-fit flex items-center gap-1.5 border border-slate-200/50">
                          <span>
                            {booking.jam_mulai_les.substring(0, 5)} -{" "}
                            {booking.jam_selesai_les.substring(0, 5)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                          booking.status === "Selesai"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : booking.status === "Batal"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        {booking.status === "Mendatang" && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateStatus(
                                  booking.id_penditem,
                                  "Selesai",
                                )
                              }
                              className="px-3 py-1.5 text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 hover:bg-green-100 rounded-lg transition-all cursor-pointer"
                            >
                              SELESAI
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(booking.id_penditem, "Batal")
                              }
                              className="px-3 py-1.5 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg transition-all cursor-pointer"
                            >
                              BATAL
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
