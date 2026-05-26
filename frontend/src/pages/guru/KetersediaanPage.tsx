import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Trash2,
  Plus,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Copy,
  ChevronRight,
  ChevronLeft,
  Save,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function KetersediaanPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [keahlianData, setKeahlianData] = useState<any | null>(null);
  const [error, setError] = useState("");

  const [days, setDays] = useState([
    {
      name: "Senin",
      active: true,
      slots: [{ id: 1, start: "08:00", end: "12:00" }],
    },
    { name: "Selasa", active: false, slots: [] },
    {
      name: "Rabu",
      active: true,
      slots: [{ id: 2, start: "08:00", end: "12:00" }],
    },
    { name: "Kamis", active: false, slots: [] },
    { name: "Jumat", active: false, slots: [] },
  ]);

  const subjects = [
    { id: "mat-sd", name: "Matematika SD" },
    { id: "fis-smp", name: "Fisika SMP" },
    { id: "kim-sma", name: "Kimia SMA" },
  ];

  const toggleDay = (index: any) => {
    const newDays = [...days];
    newDays[index].active = !newDays[index].active;
    if (newDays[index].active && newDays[index].slots.length === 0) {
      newDays[index].slots = [{ id: Date.now(), start: "08:00", end: "12:00" }];
    }
    setDays(newDays);
  };

  const addSlot = (dayIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].slots.push({
      id: Date.now(),
      start: "00:00",
      end: "00:00",
    });
    setDays(newDays);
  };

  const removeSlot = (dayIndex: number, slotId: number) => {
    const newDays = [...days];
    newDays[dayIndex].slots = newDays[dayIndex].slots.filter(
      (s) => s.id !== slotId,
    );
    setDays(newDays);
  };

  // Fungsi untuk update jam pada slot
  const updateSlot = (
    dayIndex: number,
    slotId: number,
    field: "start" | "end",
    value: string,
  ) => {
    const newDays = [...days];
    const slotIndex = newDays[dayIndex].slots.findIndex((s) => s.id === slotId);
    newDays[dayIndex].slots[slotIndex][field] = value;
    setDays(newDays);
  };

  const toggleSubject = (subjectName: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectName)
        ? prev.filter((s) => s !== subjectName)
        : [...prev, subjectName],
    );
  };

  useEffect(() => {
    fetchKeahlianData();
  }, []);

  const fetchKeahlianData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/guru/keahlian", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil data");
      }

      setKeahlianData(result.data);
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

  const handleSubmit = async () => {
    // 1. Validasi Input
    if (!startDate || !endDate) {
      alert("Harap isi Tanggal Mulai dan Tanggal Selesai!");
      return setStep(1); // Kembali ke step 1 jika kosong
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert("Tanggal Selesai tidak boleh lebih awal dari Tanggal Mulai!");
      return setStep(1);
    }

    // 2. Format Data Jadwal Harian sesuai format backend
    const activeDays = days.filter((d) => d.active && d.slots.length > 0);
    if (activeDays.length === 0) {
      alert("Harap aktifkan minimal 1 hari dengan slot jam yang valid!");
      return setStep(2);
    }

    const jadwal_harian = activeDays.map((day) => ({
      hari: day.name,
      slots: day.slots.map((slot) => ({
        jam_mulai: slot.start,
        jam_selesai: slot.end,
      })),
    }));

    // 3. Susun Payload Akhir
    const payload = {
      tanggal_awal: startDate,
      tanggal_akhir: endDate,
      jadwal_harian: jadwal_harian,
    };

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/guru/kesediaan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menyimpan jadwal");
      }

      alert("Jadwal berhasil disimpan dan dipublikasikan!");
      navigate("/guru"); // Redirect ke dashboard guru
    } catch (error) {
      if (error instanceof Error) {
        alert("Error: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-700">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-800">
            Pengaturan Ketersediaan Rutin
          </h1>
          <p className="text-slate-500 mt-1">
            Atur jadwal master Anda untuk memudahkan murid melakukan pemesanan
            rutin.
          </p>

          <div className="flex items-center gap-4 mt-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= num ? "bg-[#406749] text-white" : "bg-slate-100 text-slate-400"}`}
                >
                  {num}
                </div>
                <span
                  className={`text-sm font-semibold ${step >= num ? "text-[#406749]" : "text-slate-400"}`}
                >
                  {num === 1
                    ? "Rentang Waktu"
                    : num === 2
                      ? "Jadwal Harian"
                      : "Keahlian"}
                </span>
                {num < 3 && (
                  <ChevronRight size={16} className="text-slate-300 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#406749]/10 text-[#406749] rounded-lg flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="text-lg font-bold">Rentang Waktu Mengajar</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">
                    Tanggal Mulai
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={20}
                    />
                    <input
                      type="date"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#406749]/20 focus:border-[#406749] transition-all"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">
                    Tanggal Selesai
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={20}
                    />
                    <input
                      type="date"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#406749]/20 focus:border-[#406749] transition-all"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#406749]/10 text-[#406749] rounded-lg flex items-center justify-center font-bold">
                    2
                  </div>
                  <h2 className="text-lg font-bold">Pengaturan Harian</h2>
                </div>
              </div>

              <div className="space-y-4">
                {days.map((day, idx) => (
                  <div
                    key={day.name}
                    className={`border rounded-2xl p-5 transition-all ${day.active ? "border-[#406749]/30 bg-white" : "border-slate-100 bg-slate-50/50"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span
                          className={`font-bold text-lg w-20 ${day.active ? "text-slate-800" : "text-slate-400"}`}
                        >
                          {day.name}
                        </span>
                        {day.active && (
                          <span className="bg-[#DCFCE7] text-[#166534] text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                            Aktif
                          </span>
                        )}
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={day.active}
                          onChange={() => toggleDay(idx)}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#406749]"></div>
                      </label>
                    </div>

                    {day.active ? (
                      <div className="mt-6 space-y-4 pt-6 border-t border-slate-100">
                        {day.slots.map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center gap-4"
                          >
                            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2">
                              {/*  updateSlot agar jam yang dipilih user disimpan ke state */}
                              <input
                                type="time"
                                value={slot.start}
                                onChange={(e) =>
                                  updateSlot(
                                    idx,
                                    slot.id,
                                    "start",
                                    e.target.value,
                                  )
                                }
                                className="focus:outline-none font-semibold text-slate-700"
                              />
                              <span className="text-slate-400 font-bold text-sm">
                                ke
                              </span>
                              <input
                                type="time"
                                value={slot.end}
                                onChange={(e) =>
                                  updateSlot(
                                    idx,
                                    slot.id,
                                    "end",
                                    e.target.value,
                                  )
                                }
                                className="focus:outline-none font-semibold text-slate-700"
                              />
                              <Clock
                                size={18}
                                className="text-slate-300 ml-2"
                              />
                            </div>
                            <button
                              onClick={() => removeSlot(idx, slot.id)}
                              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => addSlot(idx)}
                          className="flex items-center gap-2 text-[#406749] font-bold text-sm bg-[#406749]/5 px-4 py-2 rounded-lg hover:bg-[#406749]/10 transition-colors"
                        >
                          <Plus size={16} /> Tambah Jam
                        </button>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-400 font-medium">
                        Anda tidak bersedia mengajar pada hari ini.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#406749]/10 text-[#406749] rounded-lg flex items-center justify-center font-bold">
                  3
                </div>
                <h2 className="text-lg font-bold">Keahlian Mengajar</h2>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              {isLoading && !keahlianData ? (
                <div className="flex items-center justify-center py-8 gap-2 text-[#406749]">
                  <Loader2 className="animate-spin" size={24} />
                  <span>Memuat keahlian Anda...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {keahlianData && keahlianData.length > 0 ? (
                    keahlianData.map((subjectName: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => toggleSubject(subjectName)}
                        className={`p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
                          selectedSubjects.includes(subjectName)
                            ? "border-[#406749] bg-[#406749]/5 shadow-sm"
                            : "border-slate-100 bg-white hover:border-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <GraduationCap
                            size={24}
                            className={
                              selectedSubjects.includes(subjectName)
                                ? "text-[#406749]"
                                : "text-slate-300"
                            }
                          />
                          {selectedSubjects.includes(subjectName) && (
                            <CheckCircle2
                              size={20}
                              className="text-[#406749]"
                            />
                          )}
                        </div>
                        <span
                          className={`font-bold ${
                            selectedSubjects.includes(subjectName)
                              ? "text-[#406749]"
                              : "text-slate-600"
                          }`}
                        >
                          {subjectName}
                        </span>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 col-span-3 text-center py-4">
                      Anda belum mendaftarkan keahlian mengajar di profil Anda.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50/80 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                Total Keseluruhan
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-black text-slate-800">
                  {days
                    .filter((d) => d.active)
                    .reduce((acc, curr) => acc + curr.slots.length, 0)}{" "}
                  Sesi Aktif
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                disabled={isLoading}
                className="flex-1 md:flex-none px-6 py-3.5 font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ChevronLeft size={20} /> Kembali
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 md:flex-none px-8 py-3.5 bg-[#406749] text-white font-bold rounded-2xl hover:bg-[#32523b] shadow-lg shadow-[#406749]/20 transition-all flex items-center justify-center gap-2"
              >
                Lanjut <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 md:flex-none px-8 py-3.5 bg-[#406749] text-white font-bold rounded-2xl hover:bg-[#32523b] shadow-lg shadow-[#406749]/20 transition-all flex items-center justify-center gap-2 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    Memproses <Loader2 size={20} className="animate-spin" />
                  </>
                ) : (
                  <>
                    Simpan & Publikasi Jadwal <Save size={20} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
