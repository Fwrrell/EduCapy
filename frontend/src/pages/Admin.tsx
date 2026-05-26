import { useState, useEffect } from "react";
export default function Admin() {
  const [murid, setMurid] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchMurid = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:3000/api/admin/murid-terdaftar",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(
            "Gagal mengambil data. Pastikan Anda login sebagai Admin.",
          );
        }

        const data = await response.json();
        setMurid(data);
      } catch (error) {
        console.error("Error fetching data murid:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMurid();
  }, []);
  return (
    <>
      <div className="flex flex-col items-center p-10">
        <div className="flex flex-col p-5 bg-white w-full rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="capitalize text-xl font-bold">murid terdaftar</h3>
            <button className="capitalize text-lg font-semibold text-[#406749]">
              lihat semua
            </button>
          </div>
          <div className="flex flex-col items-center p-5 gap-4">
            {isLoading ? (
              <p className="text-slate-500 font-medium py-10">
                Memuat data murid...
              </p>
            ) : murid.length === 0 ? (
              <p className="text-slate-500 font-medium py-10">
                Belum ada murid yang terdaftar.
              </p>
            ) : (
              murid.map((murid) => (
                <div
                  key={murid.id}
                  className="flex items-center justify-between w-full border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 rounded-xl"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-xl font-bold capitalize text-slate-800">
                      {murid.nama}
                    </span>
                    <div className="flex items-center gap-2 text-[#727971]">
                      <span className="font-medium text-md">
                        {murid.tingkat} {murid.jenjang}
                      </span>
                      <div className="w-1.5 h-1.5 bg-[#727971] rounded-full"></div>
                      <span className="text-md font-semibold">
                        {murid.jumlah_kelas} kelas
                      </span>
                    </div>
                  </div>
                  <button className="rounded-xl bg-[#406749] text-white hover:bg-slate-100 font-semibold px-6 py-3 hover:text-[#406749] duration-300 transition-colors">
                    List Kelas
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
