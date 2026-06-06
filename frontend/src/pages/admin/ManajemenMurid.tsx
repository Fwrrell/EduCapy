import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";

// mendefinisikan tipe data sesuai query
interface Murid {
  id: number | string;
  nama: string;
  tingkat: string | number;
  jenjang: string;
  jumlah_kelas: number;
}

export default function ManajemenMurid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<Murid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    alamat: "",
    jenjang: "",
    tingkat: "",
  });

  const fetchStudents = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/admin/murid-terdaftar",
        {
          method: "GET",
          headers: {
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
      setStudents(data);
    } catch (err: any) {
      console.error("Error fetching data murid:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // filter data berdasarkan pencarian nama murid
  const filteredStudents = students.filter((student) =>
    student.nama?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
  }, []);

  const listJenjang = [...new Set(dataPendidikan.map((item) => item.jenjang))];
  const listTingkat = dataPendidikan
    .filter((item) => item.jenjang === formData.jenjang)
    .map((item) => item.tingkat);

  const handleJenjangChange = (value: string) => {
    setFormData((prev) => ({ ...prev, jenjang: value, tingkat: "" }));
  };

  const handleTingkatChange = (value: string) => {
    setFormData((prev) => ({ ...prev, tingkat: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const selectedPendidikan = dataPendidikan.find(
        (p) =>
          p.jenjang === formData.jenjang &&
          String(p.tingkat) === formData.tingkat,
      );

      if (!selectedPendidikan) {
        throw new Error("Tingkat pendidikan tidak valid.");
      }

      const payload = {
        ...formData,
        id_pendidikan: selectedPendidikan.id_pendidikan,
      };

      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mendaftarkan murid");
      }

      alert("Murid berhasil didaftarkan!");
      setFormData({
        nama: "",
        email: "",
        password: "",
        alamat: "",
        jenjang: "",
        tingkat: "",
      });
      fetchStudents();
    } catch (err: any) {
      setError(err.message);
      alert("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 mx-auto space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Manajemen Murid
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola data dan jumlah kelas yang didaftarkan murid.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 cursor-pointer">
              <Plus className="w-4 h-4" />
              Tambah Murid
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Membuat Akun Murid</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Field>
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="alamat">Alamat</Label>
                  <Input
                    id="alamat"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleInputChange}
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="jenjang">Jenjang</Label>
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
                  <Label htmlFor="tingkat">Tingkat</Label>
                  <Select
                    name="tingkat"
                    value={formData.tingkat}
                    onValueChange={handleTingkatChange}
                    disabled={!formData.jenjang}
                    required
                  >
                    <SelectTrigger id="tingkat" className="w-full">
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
              </div>
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
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari nama murid..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabel Section */}
      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Nama Murid</TableHead>
              <TableHead>Jenjang Pendidikan</TableHead>
              <TableHead>Tingkat</TableHead>
              <TableHead className="text-center">Kelas Terdaftar</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    Memuat data murid...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium text-slate-500">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">
                    {student.nama}
                  </TableCell>
                  <TableCell>
                    {student.jenjang ? (
                      <Badge variant="outline">{student.jenjang}</Badge>
                    ) : (
                      <span className="text-slate-400 italic">
                        Belum diatur
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {student.tingkat ? student.tingkat : "-"}
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {student.jumlah_kelas > 0 ? (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">
                        {student.jumlah_kelas} Kelas
                      </Badge>
                    ) : (
                      <span className="text-slate-400">0 Kelas</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" title="Edit Data">
                        <Edit className="h-4 w-4 text-slate-600" />
                      </Button>
                      <Button variant="outline" size="icon" title="Hapus Data">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  Tidak ada data murid yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
