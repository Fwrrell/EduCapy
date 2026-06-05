import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Loader2,
  BookOpen,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface Guru {
  id: number;
  nama: string;
  email: string;
  pendidikan: string;
  keahlian_mapel: string | null;
}

export default function ManajemenGuru() {
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState<Guru[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    alamat: "",
    pendidikan: "",
  });

  const [dataKeahlian, setDataKeahlian] = useState<any[]>([]);
  const [selectedKeahlian, setSelectedKeahlian] = useState<number[]>([]);

  const toggleKeahlian = (id: number) => {
    setSelectedKeahlian((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchTeachers = async () => {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/admin/guru-terdaftar",
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
      setTeachers(data);
    } catch (err: any) {
      console.error("Error fetching data guru:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    const fetchKeahlian = async () => {
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
          throw new Error("Gagal mengambil data keahlian.");
        }

        const result = await response.json();
        setDataKeahlian(result.data);
      } catch (err) {
        console.log("Error fetching data keahlian: ", err);
      }
    };
    fetchKeahlian();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...formData,
        keahlian: selectedKeahlian,
      };

      const response = await fetch("http://localhost:3000/api/admin/guru", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal mendaftarkan guru");
      }

      alert("Guru berhasil didaftarkan!");
      setFormData({
        nama: "",
        email: "",
        password: "",
        alamat: "",
        pendidikan: "",
      });
      setSelectedKeahlian([]);
      fetchTeachers(); // Refresh list
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
            Manajemen Guru
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola data pengajar, latar belakang pendidikan, dan keahlian mapel.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 cursor-pointer">
              <Plus className="w-4 h-4" />
              Tambah Guru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Membuat Akun Guru</DialogTitle>
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
                    type="email"
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
                  <Label htmlFor="pendidikan">Pendidikan</Label>
                  <Input
                    id="pendidikan"
                    name="pendidikan"
                    placeholder="S1 Teknik Mesin - Institut Teknologi Bandung"
                    value={formData.pendidikan}
                    onChange={handleInputChange}
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="keahlian">Keahlian (Bisa pilih banyak)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between h-auto min-h-10 px-3 py-2 text-left font-normal"
                      >
                        <div className="flex flex-wrap gap-1">
                          {selectedKeahlian.length > 0 ? (
                            selectedKeahlian.map((id) => (
                              <Badge
                                key={id}
                                variant="secondary"
                                className="font-normal"
                              >
                                {dataKeahlian.find((k) => k.id === id)?.nama}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground">
                              Pilih keahlian...
                            </span>
                          )}
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Cari mata pelajaran..." />
                        <CommandEmpty>Mapel tidak ditemukan.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {dataKeahlian.map((item) => (
                              <CommandItem
                                key={item.id}
                                onSelect={() => toggleKeahlian(item.id)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedKeahlian.includes(item.id)
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {item.nama}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </Field>
              </div>
              {error && (
                <p className="text-sm font-bold text-red-500">⚠️ {error}</p>
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save changes"
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
            placeholder="Cari nama atau email guru"
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Nama Pengajar</TableHead>
              <TableHead>Pendidikan Terakhir</TableHead>
              <TableHead>Keahlian Mengajar (Mapel)</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mb-2" />
                    Memuat data guru...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher, index) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium text-slate-500">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold text-slate-900">
                      {teacher.nama}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {teacher.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-medium">
                      {teacher.pendidikan || "Belum diatur"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {teacher.keahlian_mapel ? (
                      <div className="flex flex-wrap gap-1">
                        {teacher.keahlian_mapel.split(", ").map((mapel, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                          >
                            <BookOpen className="w-3 h-3 mr-1" />
                            {mapel}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic text-sm">
                        Belum ada mapel
                      </span>
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
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  Tidak ada data guru yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
