import { Input } from "@/components/ui/input";
import { LockIcon, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("murid");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email dan Password harus diisi!");
      return;
    }

    setIsLoading(true);

    const payload = {
      email: email,
      password: password,
      role: role,
    };

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login gagal");
      }

      localStorage.setItem("token", result.token);

      alert("Login berhasil");
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
          <div className="flex flex-col gap-0 my-auto">
            {/* Header */}
            <div className="flex flex-col gap-3 pb-[18px]">
              <h1 className="font-bold text-[32px] leading-10 text-main-text flex items-center gap-2">
                Masuk ke EduCapy 👋
              </h1>
            </div>

            {/* Toggle Role Selector */}
            <div className="w-full bg-[#F3F4F6] p-1 rounded-full flex items-center mb-6 mt-2">
              <button
                type="button"
                onClick={() => setRole("murid")}
                className={`flex-1 py-2.5 text-center font-poppins font-bold text-sm rounded-full transition-all cursor-pointer ${
                  role === "murid"
                    ? "bg-white text-brand-green shadow-sm"
                    : "text-brand-gray"
                }`}
              >
                Sebagai Murid
              </button>
              <button
                type="button"
                onClick={() => setRole("guru")}
                className={`flex-1 py-2.5 text-center font-poppins font-bold text-sm rounded-full transition-all cursor-pointer ${
                  role === "guru"
                    ? "bg-white text-brand-green shadow-sm"
                    : "text-brand-gray"
                }`}
              >
                Sebagai Guru
              </button>
            </div>

            {/* Form Content Berdasarkan Step */}
            <div className="flex flex-col gap-5 mt-2">
              <Input
                label="Alamat Email"
                placeholder="Enter your email"
                type="email"
                icon={<Mail color="#9ca3af" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Password"
                placeholder="Enter your password"
                type="password"
                icon={<LockIcon color="#9ca3af" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between w-full mt-4 font-poppins text-sm">
              <label className="flex items-center gap-2 text-main-text cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-brand-green focus:ring-brand-green/30"
                />
                Ingat Saya
              </label>
              <Link
                to="/forgot-password"
                className="font-bold text-[#8C4E2D] hover:underline"
              >
                Lupa Password?
              </Link>
            </div>
          </div>

          {/* Button Section */}
          <div className="flex flex-col gap-0 mt-8">
            {error && (
              <p className="text-sm font-bold text-red-500">⚠️ {error}</p>
            )}
            <div className="flex items-center gap-4 w-full mt-4">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-1 py-[14px] rounded-2xl bg-brand-green shadow-[0_4px_12px_0_rgba(54,51,48,0.04)] hover:bg-opacity-90 transition-colors cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <span className="font-bold text-lg text-white tracking-[0.14px] leading-5">
                  {isLoading ? "Memproses.." : "Sign In →"}
                </span>
              </button>
            </div>

            {/* Footer */}
            <div className="flex flex-col items-start pt-3 mt-6 border-t border-[#C1C8BF4D]">
              <div className="flex items-center justify-center gap-2 w-full">
                <span className="font-poppins font-normal text-base text-main-text leading-6">
                  Belum punya akun?
                </span>
                <Link
                  to="/register"
                  className="font-poppins font-bold text-base text-brand-green leading-6 hover:underline"
                >
                  Buat Akun.
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
