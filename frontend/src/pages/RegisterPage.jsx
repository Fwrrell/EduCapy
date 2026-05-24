import { Input } from "@/components/ui/input";
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  LockIcon,
  Mail,
  MapPin,
  UserIcon,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SelectField({ label, placeholder, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <label className="font-poppins font-bold text-sm text-main-text tracking-[0.14px] leading-5">
        {label}
      </label>
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          <ChevronDown size={20} color="#9CA3AF" />
        </div>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none pl-[45px] pr-3 py-[13px] rounded-lg border border-[#e5e7eb] bg-brand-inputbg font-poppins text-base text-main-text focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-colors cursor-pointer"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function RegisterPage() {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // State Step 1
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alamat, setAlamat] = useState("");

  // State Step 2
  const [dataPendidikan, setDataPendidikan] = useState([]);
  const [jenjang, setJenjang] = useState("");
  const [tingkat, setTingkat] = useState("");

  // ambil data dari backend di table tingkat_pendidikan
  useEffect(() => {
    fetch("http://localhost:3000/api/murid/tingkat-pendidikan")
      .then((res) => res.json())
      .then((data) => setDataPendidikan(data))
      .catch((err) => console.error("Gagal mengambil data: ", err));
  }, []);

  // ambil data jenjang
  const listJenjang = [...new Set(dataPendidikan.map((item) => item.jenjang))];
  // filter pilihan tingkat berdasarkan jenjang yang diisi
  const listTingkat = dataPendidikan
    .filter((item) => item.jenjang === jenjang)
    .map((item) => `Kelas ${item.tingkat}`);

  // handler ketika jenjang berubah
  const handleJenjangChange = (value) => {
    setJenjang(value);
    setTingkat("");
  };

  const steps = [
    { num: 1, label: "Data Diri" },
    { num: 2, label: "Pendidikan" },
    { num: 3, label: "Konfirmasi" },
  ];

  const handleNextStep = () => {
    setError("");

    // cek apakah form di step 1 terisi semua
    if (step === 1) {
      if (
        !namaLengkap.trim() ||
        !email.trim() ||
        !password.trim() ||
        !alamat.trim()
      ) {
        setError("Semua form di halaman ini wajib diisi!");
        return;
      }
    }

    // cek apakah form di step 2 terisi semua
    if (step === 2) {
      if (!jenjang || !tingkat) {
        setError("Semua form di halaman ini wajib diisi!");
        return;
      }
    }

    // kalo terisi maka lanjut stepnya
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // mencegah reload halaman ketika submit
    setError("");
    setIsLoading(true);

    // ambil tingkat berapa
    const numTingkat = parseInt(tingkat.replace("Kelas ", ""), 10);
    // cari id jenjang dengan tingkat
    const idPendidikan = dataPendidikan.find(
      (item) => item.jenjang === jenjang && item.tingkat === numTingkat,
    );

    if (!idPendidikan) {
      setError("Pilihan jenjang dan tingkat pendidikan tidak valid!");
      setIsLoading(false);
      return;
    }

    // susun payload sesuai dengan apa yang diminta server (backend)
    const payload = {
      nama: namaLengkap,
      email: email,
      password: password,
      alamat: alamat,
      id_pendidikan: idPendidikan.id_pendidikan,
    };

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registrasi gagal");
      }

      alert("Registrasi berhasil");

      navigate("/app");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-main-bg flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[1092px] flex rounded-[30px] overflow-hidden shadow-lg">
        {/* LEFT PANEL - gambar promosi (brand / promosi) */}
        <div className="hidden lg:block lg:w-[53%] bg-[#9CA3AF] rounded-l-[30px] min-h-[779px]" />

        {/* RIGHT PANEL - form */}
        <div className="w-full lg:w-[47%] bg-white rounded-[30px] lg:rounded-l-none flex flex-col justify-between px-8 sm:px-12 py-10 sm:py-12">
          <div className="flex flex-col gap-0">
            {/* Header */}
            <div className="flex flex-col gap-3 pb-[18px]">
              <div className="flex items-center gap-4">
                <BookOpen size={27} color="#406749" />
                <h1 className="font-bold text-[32px] leading-10 text-main-text">
                  Buat Akun
                </h1>
              </div>

              {/* Stepper */}
              <div className="flex items-start w-full mt-2">
                {steps.map((s, i) => {
                  const isCompleted = step > s.num;
                  const isActive = step === s.num;
                  const isLast = i === steps.length - 1;

                  return (
                    <div
                      key={s.num}
                      className="flex items-start flex-1 last:flex-none"
                    >
                      <div className="flex flex-col items-center gap-1">
                        {isCompleted ? (
                          <div className="w-[51px] h-[51px] rounded-full bg-brand-green flex items-center justify-center">
                            <Check size={24} color="white" />
                          </div>
                        ) : (
                          <div
                            className={`w-[51px] h-[51px] rounded-full flex items-center justify-center ${
                              isActive ? "bg-brand-green" : "bg-brand-inputbg"
                            }`}
                          >
                            <span
                              className={`font-poppins font-bold text-xl ${
                                isActive ? "text-white" : "text-main-text"
                              }`}
                            >
                              {s.num}
                            </span>
                          </div>
                        )}
                        <span
                          className={`font-poppins font-bold text-xs mt-2 ${
                            isActive ? "text-main-text" : "text-brand-gray"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>

                      {!isLast && (
                        <div
                          className={`flex-1 h-[2px] mt-[25px] mx-1 ${
                            step > s.num ? "bg-brand-green" : "bg-brand-inputbg"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Form Content Berdasarkan Step */}
            <div className="flex flex-col gap-5 mt-6 min-h-[300px]">
              {/* Data Diri */}
              {step === 1 && (
                <>
                  <Input
                    label="Nama Lengkap"
                    placeholder="Budi Capy"
                    icon={<UserIcon color="#9ca3af" />}
                    value={namaLengkap}
                    onChange={(e) => setNamaLengkap(e.target.value)}
                  />
                  <Input
                    label="Email"
                    placeholder="budi@gmail.com"
                    type="email"
                    icon={<Mail color="#9ca3af" />}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    label="Password"
                    placeholder="••••••••"
                    type="password"
                    icon={<LockIcon color="#9ca3af" />}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Input
                    label="Alamat"
                    placeholder="Jl. Ciumbuleuit No. 67"
                    icon={<MapPin color="#9ca3af" />}
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                  />
                </>
              )}

              {/* Pendidikan */}
              {step === 2 && (
                <>
                  <SelectField
                    label="Jenjang Pendidikan"
                    placeholder="Pilih Jenjang Pendidikan"
                    options={listJenjang}
                    value={jenjang}
                    onChange={handleJenjangChange}
                  />
                  <SelectField
                    label="Tingkat Pendidikan"
                    placeholder="Pilih Tingkat Pendidikan"
                    options={listTingkat}
                    value={tingkat}
                    onChange={setTingkat}
                    disabled={!jenjang}
                  />
                </>
              )}

              {/* Konfirmasi */}
              {step === 3 && (
                <div className="flex flex-col items-center justify-center py-12 text-center h-full">
                  <Check size={56} className="text-brand-green mb-4" />
                  <h2 className="font-bold text-2xl text-main-text">
                    Hampir Selesai!
                  </h2>
                  <p className="text-brand-gray mt-2 text-sm">
                    Pastikan seluruh data diri dan pendidikan Anda telah sesuai.
                    Klik daftar untuk menyelesaikan pembuatan akun.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Button Section */}
          <div className="flex flex-col gap-0 mt-8">
            {error && (
              <p className="text-sm font-bold text-red-500">⚠️ {error}</p>
            )}
            <div className="flex items-center gap-4 w-full mt-6">
              {step > 1 && (
                <button
                  onClick={handlePrevStep}
                  className="w-full flex items-center justify-center gap-1 py-[14px] rounded-2xl border-2 border-brand-green text-brand-green hover:bg-brand-green/5 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-lg text-main-text tracking-[0.14px] leading-5">
                    Kembali
                  </span>
                </button>
              )}
              <button
                onClick={step === 3 ? handleSubmit : handleNextStep}
                className="w-full flex items-center justify-center gap-1 py-[14px] rounded-2xl bg-brand-green shadow-[0_4px_12px_0_rgba(54,51,48,0.04)] hover:bg-opacity-90 transition-colors cursor-pointer"
              >
                <span className="font-bold text-lg text-white tracking-[0.14px] leading-5">
                  {isLoading ? "Memproses.." : step === 3 ? "Daftar" : "Lanjut"}
                </span>
                {step !== 3 && <ChevronRight color="#f7f7f7" />}
              </button>
            </div>

            {/* Footer */}
            <div className="flex flex-col items-start pt-3 mt-3 border-t border-[#C1C8BF4D]">
              <div className="flex items-center justify-center gap-2 w-full">
                <span className="font-poppins font-normal text-base text-main-text leading-6">
                  Sudah punya akun?
                </span>
                <Link
                  to="/login"
                  className="font-poppins font-bold text-base text-brand-green leading-6 hover:underline"
                >
                  Masuk.
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
