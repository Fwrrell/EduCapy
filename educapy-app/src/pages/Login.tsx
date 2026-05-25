import Logo from "../assets/logo-educapy 1.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", data.user.nama);
        navigate("/MainPage");
      } else {
        alert("Login gagal: " + data.error);
      }
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Gagal terhubung ke server!");
    }
  };
  return (
    <>
      <div className="flex items-center justify-center w-full h-screen bg-white p-5">
        <div className="flex w-full max-w-5xl min-h-[600px] rounded-3xl shadow-xl">
          <div className="bg-slate-200 flex flex-col items-center justify-center p-10">
            <img src={Logo} alt="logo-educapy" className="w-56 h-56" />
            <h1 className="text-xl font-bold ">
              Selamat datang kembali di educapy!
            </h1>
          </div>
          <div className="w-full md:w-1/2 p-12 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              <LogIn /> masuk ke educapy 👋
            </h2>
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <div>
                <label htmlFor="email" className="text-lg font-bold mb-2">
                  Alamat Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="masukkan emailmu"
                  className="w-full mt-3 p-3 border border-slate-300 rounded-lg bg-slate-50"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="password" className="text-lg font-bold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="masukkan passwordmu"
                  required
                  className=" focus:outline-none focus:border-[#406749] focus:ring-1 focus:ring-[#406749] w-full mt-3 p-3 border border-slate-300 rounded-lg bg-slate-50"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="mt-4 w-full py-3 bg-[#406749] text-white font-bold rounded-lg hover:bg-[#2d4a34] transition-colors"
              >
                Masuk
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-slate-500">
              Belum punya akun?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-[#406749] font-bold cursor-pointer hover:underline"
              >
                Daftar sekarang.
              </span>
            </p>
            {/* <button className="rounded-xl font-bold text-xl text-[#406749]">
                Sebagai murid
              </button>
              <button className="rounded-xl font-bold text-xl text-[#406749]">
                Sebagai murid
              </button> */}
          </div>
        </div>
      </div>
    </>
  );
}
