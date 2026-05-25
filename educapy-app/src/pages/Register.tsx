import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, SquareUser, Mail, GraduationCap } from "lucide-react";
import logo from "../assets/logo-educapy 1.png";
import { FaRegAddressBook } from "react-icons/fa6";
export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    alamat: "",
    jenjang: "",
    tingkat: "",
  });
  const daftarKelas = {
    SD: [1, 2, 3, 4, 5, 6],
    SMP: [7, 8, 9],
    SMA: [10, 11, 12],
  };
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama: formData.nama,
          email: formData.email,
          password: formData.password,
          alamat: formData.alamat,
          jenjang: formData.jenjang,
          tingkat: formData.tingkat,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", formData.nama);
        navigate("/MainPage");
      } else {
        alert("Pendaftaran gagal: " + data.error);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Gagal terhubung ke server!");
    }
  };
  return (
    <>
      <div className="flex h-screen w-full bg-[#f8fafc] items-center justify-center p-5">
        <div className="flex w-full max-w-5xl min-h-[600px] bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="flex flex-col justify-center items-center bg-slate-200 p-20">
            <img src={logo} alt="logo-educapy" className="w-48 h-48 " />
            <h1 className="capitalize text-2xl tracking-[1.2] font-bold ">
              selamat datang di EduCapy!
            </h1>
          </div>
          <div className="w-full md:w-1/2 p-8 flex flex-col relative overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
              <SquareUser className="w-8 h-8" /> Buat Akun
            </h2>
            <div className="flex items-center justify-between mb-10 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0"></div>
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0 transition-all duration-500"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className="flex flex-col items-center z-10 gap-10"
                >
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-colors duration-300 ${
                      step >= num
                        ? "bg-[#406749] text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {step > num ? <Check className="w-7 h-7" /> : num}
                  </div>
                  <span className="text-md mt-7 font-bold text-slate-500 absolute top-10 whitespace-nowrap">
                    {num === 1
                      ? "Data Diri"
                      : num === 2
                        ? "Pendidikan"
                        : "Konfirmasi"}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex-1 mt-6">
              {step === 1 && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <label htmlFor="nama" className="text-md font-bold">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="nama"
                      id="nama"
                      placeholder="CapyBowo"
                      required
                      className="w-full mt-3 p-3 border border-slate-300 rounded-lg bg-slate-50"
                      value={formData.nama}
                      onChange={(e) =>
                        setFormData({ ...formData, nama: e.target.value })
                      }
                    />
                  </div>
                  {/* input email */}
                  <div>
                    <label htmlFor="email" className="text-md font-bold">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      id="email"
                      placeholder="Capybara@gmail.com"
                      className="w-full mt-3 p-3 border border-slate-300 rounded-lg bg-slate-50"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  {/* input password */}
                  <div>
                    <label htmlFor="pass" className="text-md font-bold">
                      Password
                    </label>
                    <input
                      type="password"
                      name="pass"
                      required
                      id="pass"
                      className="w-full mt-3 p-3 border border-slate-300 rounded-lg bg-slate-50"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                  {/* alamat */}
                  <div>
                    <label htmlFor="alamat" className="text-md font-bold">
                      Alamat
                    </label>

                    <input
                      type="text"
                      name="alamat"
                      id="alamat"
                      required
                      className="w-full mt-3 mb-4 p-3 border border-slate-300 rounded-lg bg-slate-50"
                      placeholder="Jalan Pegangsaan Timur No. 56"
                      value={formData.alamat}
                      onChange={(e) =>
                        setFormData({ ...formData, alamat: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div>
                    <label className="text-sm font-bold text-slate-700">
                      Jenjang Pendidikan
                    </label>
                    <select
                      className="w-full mt-1 p-3 border border-slate-300 rounded-lg bg-slate-50"
                      value={formData.jenjang}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          jenjang: e.target.value,
                          tingkat: "",
                        });
                      }}
                    >
                      <option>Pilih Jenjang Pendidikan</option>
                      <option value="SD">SD</option>
                      <option value="SMP">SMP</option>
                      <option value="SMA">SMA</option>
                    </select>
                  </div>
                  {/* tingkat pendidikan */}
                  <div>
                    <label htmlFor="Tingkat Pendidikan">
                      Tingkat Pendidikan
                    </label>
                    <select
                      name="Tingkat Pendidikan"
                      id="tingkatPendidikan"
                      disabled={!formData.jenjang}
                      value={formData.tingkat}
                      onChange={(e) =>
                        setFormData({ ...formData, tingkat: e.target.value })
                      }
                      className={`w-full mt-3 p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-[#406749] focus:ring-1 focus:ring-[#406749] ${
                        !formData.jenjang
                          ? "bg-slate-200 cursor-not-allowed text-slate-400"
                          : "bg-slate-50 text-slate-700"
                      }`}
                    >
                      {formData.jenjang &&
                        daftarKelas[
                          formData.jenjang as keyof typeof daftarKelas
                        ].map((kelas) => (
                          <option key={kelas} value={kelas}>
                            Kelas {kelas}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h3 className="font-bold text-2xl text-slate-800 tracking-wider">
                    Konfirmasi Pendaftaran
                  </h3>
                  <p className="text-lg text-slate-500">
                    Satu langkah untuk bergabung dengan EduCapy!
                  </p>
                  <div className="rounded-xl shadow-md flex flex-col p-8 gap-8">
                    <div className="border-b-2 border-[#E8E1DD] p-2 flex items-center gap-6">
                      <div className="rounded-full p-3 bg-[#C1EDC8]">
                        <FaRegAddressBook className="w-7 h-7" color="#406749" />
                      </div>
                      <div className="flex flex-col font-semibold">
                        <span className="text-[#424942]">Nama Lengkap</span>
                        <p className="font-bold text-lg">
                          {formData.nama || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="border-b-2 border-[#E8E1DD] p-2 flex items-center gap-6">
                      <div className="rounded-full p-3 bg-[#FFDCC1]">
                        <Mail className="w-7 h-7" color="#825427" />
                      </div>
                      <div className="flex flex-col font-semibold">
                        <span className="text-[#424942]">Alamat Email</span>
                        <p className="font-bold text-lg">
                          {formData.email || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="border-b-2 border-[#E8E1DD] p-2 flex items-center gap-6">
                      <div className="rounded-full p-3 bg-[#FFE17A]">
                        <GraduationCap className="w-7 h-7" color="#715C00" />
                      </div>
                      <div className="flex flex-col font-semibold">
                        <span className="text-[#424942]">Tipe Akun</span>
                        <p className="font-bold text-lg">
                          {formData.jenjang
                            ? `Murid ${formData.jenjang} - Kelas ${formData.tingkat}`
                            : "Murid"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* button */}
            <div className="mt-8 flex gap-4">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border-2 border-[#406749] text-[#406749] font-bold rounded-lg hover:bg-slate-50 w-1/3"
                >
                  Kembali
                </button>
              )}

              <button
                onClick={step === 3 ? handleSubmit : nextStep}
                className="px-6 py-3 bg-[#406749] text-white font-bold rounded-lg hover:bg-[#2d4a34] flex-1"
              >
                {step === 3 ? "Daftar →" : "Lanjut →"}
              </button>
            </div>
            <p className="mt-6 text-center text-sm text-slate-500">
              Sudah punya akun?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-[#406749] font-bold cursor-pointer hover:underline"
              >
                Masuk di sini.
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
