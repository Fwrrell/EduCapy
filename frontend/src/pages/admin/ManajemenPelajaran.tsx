import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  DatabaseIcon,
  Loader2,
  MoreVertical,
  Plus,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Mapel {
  id: number | string;
  nama: string;
  jenjang: string;
  pengajar: string | null;
}

export default function ManajemenPelajaran() {
  const [mapel, setMapel] = useState<Mapel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nama: "",
    jenjang: "",
    tingkat: "",
  });

  const fetchMapel = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/admin/mata-pelajaran",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data");
      }

      const data = await response.json();

      console.log("response data: ", data);
      setMapel(data.data);
    } catch (err: any) {
      console.error("Error fetching data mata pelajaran:", err);
      setError("Gagal mengambil data mata pelajaran");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMapel();
  }, []);

  const [dataPendidikan, setDataPendidikan] = useState<
    Array<{
      [x: string]: any;
      jenjang: string;
      tingkat: number;
    }>
  >([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/murid/tingkat-pendidikan")
      .then((res) => res.json())
      .then((data) => setDataPendidikan(data))
      .catch((err) => console.error("Gagal mengambil data: ", err));
  });

  const listJenjang = [...new Set(dataPendidikan.map((item) => item.jenjang))];
  const listTingkat = dataPendidikan
    .filter((item) => item.jenjang === formData.jenjang)
    .map((item) => item.tingkat);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleJenjangChange = (value: string) => {
    setFormData((prev) => ({ ...prev, jenjang: value, tingka: "" }));
  };

  const handleTingkatChange = (value: string) => {
    setFormData((prev) => ({ ...prev, tingkat: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/admin/mata-pelajaran",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal membuat mata pelajaran");
      }

      setFormData({ nama: "", jenjang: "", tingkat: "" });
      fetchMapel();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Manajemen Pelajaran
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola data Mata Pelajaran yang tersedia.
          </p>
        </div>
        {/* Button add mapel */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 cursor-pointer">
              <Plus className="w-4 h-4" />
              Tambah Mata Pelajaran
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Membuat Mata Pelajaran</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Field>
                  <Label htmlFor="nama">Nama</Label>
                  <Input
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="jenjang">Jenjang Pendidikan</Label>
                  <Select
                    name="jenjang"
                    value={formData.jenjang}
                    onValueChange={handleJenjangChange}
                    required
                  >
                    <SelectTrigger id="jenjang" className="w-full">
                      <SelectValue placeholder="Pilih Jenjang" />
                    </SelectTrigger>
                    <SelectContent>
                      {listJenjang.map((jenjang) => (
                        <SelectItem key={jenjang} value={jenjang}>
                          {jenjang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <Label htmlFor="tingkat">Tingkat Pendidikan</Label>
                  <Select
                    name="tingkat"
                    value={formData.tingkat}
                    onValueChange={handleTingkatChange}
                    disabled={!formData.jenjang}
                    required
                  >
                    <SelectTrigger id="jenjang" className="w-full">
                      <SelectValue
                        placeholder={
                          formData.jenjang
                            ? "Pilih Tingkat"
                            : "Pilih jenjang dahulu"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {listTingkat.map((tingkat) => (
                        <SelectItem key={tingkat} value={String(tingkat)}>
                          Kelas {tingkat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                {error && (
                  <p className="text-sm font-bold text-red-500">⚠️ {error}</p>
                )}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="cursor-pointer">
                      Batalkan
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* COntent */}
      <div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" />
            <p>Memuat data mata pelajaran...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
            {error}
          </div>
        ) : mapel.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-slate-900">
              Belum ada mata pelajaran
            </h3>
            <p className="text-slate-500">
              Silakan tambah mata pelajaran baru untuk memulai.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mapel.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl duration-200 flex flex-col"
              >
                {/* Header card */}
                <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider">
                        {item.jenjang}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 capitalize">
                      {item.nama.toLowerCase()}
                    </h3>
                  </div>
                </div>

                {/* section list guru */}
                <div className="p-5 flex-grow">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-600 mb-3">
                    <Users className="w-4 h-4" />
                    <span>
                      Guru Pengajar{" "}
                      {item.pengajar
                        ? `(${item.pengajar.split(", ").length})`
                        : "(0)"}
                    </span>
                  </div>

                  {item.pengajar ? (
                    <div className="flex flex-wrap gap-2">
                      {item.pengajar.split(", ").map((namaGuru, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-slate-100 text-slate-700 text-sm rounded-md border border-slate-200"
                        >
                          {namaGuru}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">
                      Belum ada guru yang ditugaskan.
                    </p>
                  )}
                </div>

                {/* Footer card */}
                <div className="p-4 bg-slate-50 rounded-b-xl border-t border-slate-100 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs cursor-pointer"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="text-xs cursor-pointer"
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
