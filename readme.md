# EduCapy 🎓

EduCapy adalah platform aplikasi les privat yang menjembatani murid dengan guru secara efisien. Aplikasi ini dirancang untuk memberikan fleksibilitas dalam pendaftaran, penjadwalan les privat melalui website, termasuk fitur **Split Booking** yang memungkinkan murid mencari guru pengganti apabila guru utama tidak tersedia pada rentang kontrak masa belajar yang diinginkan.

## ✨ Fitur Utama

#### **Murid**
   - **Pencarian & Pendaftaran:** Murid dapat memilih guru dan mendaftar jadwal les berdasarkan kesediaan guru.
   - **Split Booking (Guru Pengganti):** Sistem otomatis mendeteksi jika masa kontrak melebihi kesediaan guru utama dan menawarkan opsi guru pengganti.
   - **Dashboard & Jadwal:** Pantau kelas hari ini, mendatang, selesai, dan dibatalkan secara real-time.
   - **Autentikasi JWT:** Keamanan data sesi menggunakan JSON Web Token.

#### **Guru**
   - **Manajemen Kesediaan:** Fleksibilitas dalam mendaftarkan rentang tanggal dan jam mengajar.
   - **Kalender & Dashboard:** Visualisasi jadwal dalam bentuk kalender dan manajemen histori sesi (ubah/batal).

#### **Admin**
   - **Manajemen User:** Kontrol penuh atas data akun murid dan guru.
   - **Manajemen Akademik:** Pengelolaan mata pelajaran dan tingkat pendidikan.

## 🛠️ Tech Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS, Lucide React.
- **Backend:** Node.js, Express.js, MySQL (mysql2 pool), JWT.

---

## ⚙️ Panduan Instalasi & Setup

## 1. Setup Database (MySQL)
1. Nyalakan server MySQL (misalnya lewat **XAMPP** atau **MySQL Workbench**).
2. Buat database baru dengan nama **`educapy`**.
3. Jalankan file **`EduCapy.sql`** yang ada di root folder untuk membuat skema tabel dan data dummy.
4. Konfigurasi file **`.env`** di folder `backend` sesuai kebutuhan:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=educapy
   DB_PORT=3306
   JWT_SECRET="secret123!"

### 2. Instalasi Dependensi

Jalankan perintah berikut di folder **backend** dan **frontend**:

```bash
# Di terminal 1 (Backend)
cd backend && npm install

# Di terminal 2 (Frontend)
cd frontend && npm install
```

### 3. Menjalankan Aplikasi

```bash
# Terminal 1 (Backend)
cd backend && npm run dev

# Terminal 2 (Frontend)
cd frontend && npm run dev
```

---

## 🔑 Daftar Akun Dummy

| Role      | Nama          | Email                    | Password   |
| :-------- | :------------ | :----------------------- | :--------- |
| **Admin** | Superadmin    | `admin@educapy.com`      | `admin123` |
| **Guru**  | Agus          | `Agus@gmail.com`         | `murid123` |
| **Guru**  | Kapi          | `Kapi@gmail.com`         | `murid123` |
| **Guru**  | Doni          | `Doni@gmail.com`         | `murid123` |
| **Murid** | John Doe      | `JohnDoe@gmail.com`      | `murid123` |
| **Murid** | Hansel        | `Hansel@gmail.com`       | `murid123` |
| **Murid** | Ivan Kumalala | `ivankumalala@gmail.com` | `murid123` |

---

## 📂 Struktur Proyek

- `/backend`: API server, konfigurasi database, dan logic autentikasi.
- `/frontend`: Interface pengguna, state management, dan styling.
- `EduCapy.sql`: Skema database lengkap dengan data dummy terbaru.
