import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Loader2, BookOpen } from "lucide-react";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorSubmmitting, setErrorSubmitting] = useState("");

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    alamat: "",
    pendidikan: "",
    keahlian: [] as any[],
  });

  //   const listMapel = await fetch("h ttp://localhost:3000/api/guru/keahlian");

  useEffect(() => {
    const fetchTeachers = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          "http://localhost:3000/api/admin/guru-terdaftar",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        console.error("Error fetching data murid:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="pt-8 max-w-7xl mx-auto space-y-6">
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
          <form>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 cursor-pointer">
                <Plus className="w-4 h-4" />
                Tambah Guru
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Membuat Akun Guru</DialogTitle>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <Label htmlFor="name-1">Nama Lengkap</Label>
                  <Input id="name-1" name="name" value={formData.nama} />
                </Field>
                <Field>
                  <Label htmlFor="name-1">Email</Label>
                  <Input id="name-1" name="name" value={formData.email} />
                </Field>
                <Field>
                  <Label htmlFor="name-1">Password</Label>
                  <Input
                    id="name-1"
                    type="password"
                    name="name"
                    value={formData.password}
                  />
                </Field>
                <Field>
                  <Label htmlFor="name-1">Alamat</Label>
                  <Input id="name-1" name="name" value={formData.alamat} />
                </Field>
                <Field>
                  <Label htmlFor="name-1">Pendidikan</Label>
                  <Input
                    id="name-1"
                    name="name"
                    placeholder="S1 Teknik Mesin - Institut Teknologi Bandung"
                    value={formData.pendidikan}
                  />
                </Field>
                <Field>
                  <Label htmlFor="name=1">Keahlian</Label>
                  <Select>
                    <SelectTrigger className="w-full max-w-48">
                      <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Mata Pelajaran</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                        <SelectItem value="blueberry">Blueberry</SelectItem>
                        <SelectItem value="grapes">Grapes</SelectItem>
                        <SelectItem value="pineapple">Pineapple</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari nama atau email guru..."
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
