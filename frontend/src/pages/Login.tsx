import Logo from "@/assets/logo-educapy 1.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function () {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("murid");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Email dan Password harus diisi!");
      return;
    }

    setIsLoading(true);

    const payload = {
      email: formData.email,
      password: formData.password,
      role: role,
    };

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.data.role);

      if (data.data.role === "guru") {
        navigate("/guru");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
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

            {/* Toggle Role Selector */}
            <div className="w-full bg-slate-100 p-1 rounded-full flex items-center mb-6 mt-2">
              <button
                type="button"
                onClick={() => setRole("murid")}
                className={`flex-1 py-2.5 text-center font-bold text-sm rounded-full transition-all cursor-pointer ${
                  role === "murid"
                    ? "bg-white text-[#406749] shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Sebagai Murid
              </button>
              <button
                type="button"
                onClick={() => setRole("guru")}
                className={`flex-1 py-2.5 text-center font-bold text-sm rounded-full transition-all cursor-pointer ${
                  role === "guru"
                    ? "bg-white text-[#406749] shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Sebagai Guru
              </button>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-3 w-full">
              <div>
                <label htmlFor="email" className="text-lg font-bold mb-2">
                  Alamat Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="masukkan emailmu"
                  className="w-full mt-3 p-3 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:border-[#406749] focus:ring-1 focus:ring-[#406749]"
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between w-full mt-4 text-sm">
                <label className="flex items-center gap-2 text-slate-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-[#406749] focus:ring-[#406749]/30"
                  />
                  Ingat Saya
                </label>
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="font-bold text-[#8C4E2D] hover:underline cursor-pointer"
                >
                  Lupa Password?
                </span>
              </div>

              {error && (
                <p className="text-sm font-bold text-red-500 mt-2">
                  ⚠️ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 w-full py-3 bg-[#406749] text-white font-bold rounded-lg hover:bg-[#2d4a34] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Memproses.." : "Masuk"}
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
          </div>
        </div>
      </div>
    </>
  );
}
