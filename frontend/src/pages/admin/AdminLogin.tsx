import Logo from "@/assets/logo-educapy 1.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      role: "admin",
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

      navigate("/admin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50/50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 flex flex-col items-center text-center">
          <div className="bg-slate-200 p-3 rounded-full mb-2">
            <img
              src={Logo}
              alt="logo-educapy"
              className="w-12 h-12 brightness-100"
            />
          </div>
          <CardTitle className="text-2xl flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-slate-800" />
            Admin Login
          </CardTitle>
          <CardDescription>Portal Administrasi EduCapy</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Admin</Label>
              <Input
                id="email"
                type="email"
                placeholder="masukkan email admin"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="masukkan password admin"
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            {error && (
              <p className="text-sm font-medium text-destructive text-center">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Memproses..." : "Masuk ke Panel"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center border-t p-4 mt-2">
          <Button
            variant="link"
            onClick={() => navigate("/login")}
            className="text-muted-foreground text-sm"
          >
            Kembali ke login user
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
