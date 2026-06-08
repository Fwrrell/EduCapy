# EduCapy 🎓

EduCapy adalah platform aplikasi les privat yang menjembatani murid dengan guru. Aplikasi ini dirancang untuk memberikan fleksibilitas dalam pendaftaran, penjadwalan les privat melalui website, termasuk fitur **Split Booking** yang memungkinkan murid mencari guru pengganti apabila guru utama tidak tersedia pada rentang kontrak masa belajar yang diinginkan.

## ✨ Fitur Utama

1. Murid
   - **Pencarian & Pendaftaran jadwal les privat:** murid dapat memilih guru dan mendaftar jadwal les yang diinginkan untuk setiap hari berdasarkan jadwal kesediaan guru.
   - **Split Booking (Guru Pengganti):** Sistem otomatis mendeteksi jika masa kontrak murid melebihi kesediaan guru yang dipilih, dan menawarkan opsi penambahan guru pengganti di hari & jam yang persis sama untuk sisa kontrak belajar.
   - **Dashboard & jadwal murid:** Menampilkan kelas hari ini, kelas mendatang, kelas selesai, dan kelas dibatalkan.
   - **Riwayat Kelas:** menampilkan tanggal sesi terjadwal, sisa sesi yang sedang berjalan, serta jumlah sesi pada jadwal secara _real-time_.
   - **autentikasi dengan JWT:** Autentikasi berbasis _JSON Web Token_ untuk melindungi data sesi murid.
2. Guru
   - **Pendaftaran jadwal kesediaan mengajar:** guru dapat mendaftarkan jadwal kesediaan mengajar yang diinginkan dengan fleksibilitas rentang jadwal mengajar beserta jam mengajar untuk setiap sesi dan hari.
   - **Kalendar Jadwal:** dashboard kalendar untuk menampilkan jadwal sesi les privat yang telah didaftarkan murid.
   - **Dashboard Booking**: guru dapat melihat histori sesi les privat serta mengubah dan membatalkan sesi les.
3. Admin
   - **Manajemen Murid & guru:** manajemen murid untuk mengubah data akun murid dan guru.
   - **Manajemen Mata Pelajaran:** manajemen mata pelajaran dengan menambahkan mata pelajaran baru untuk setiap tingkat pendidikan.

## 🛠️ Tech Stack

**Frontend:**

- React (Vite)
- TypeScript
- Tailwind CSS
- Lucide React & React Icons

**Backend:**

- Node.js
- Express.js
- MySQL (menggunakan `mysql2` dengan _connection pool_)
- JWT (JSON Web Token)

---

## 🚀 Prasyarat Sistem

Sebelum menjalankan proyek ini, pastikan sistem Anda sudah terinstal:

1.  **Node.js** (v16.x atau lebih baru)
2.  **npm** atau **yarn** (Package Manager)
3.  **MySQL Server** (bisa menggunakan XAMPP, WAMP, atau MySQL Workbench)

---

## ⚙️ Panduan Instalasi & Setup

Proyek ini terbagi menjadi dua direktori utama: `frontend` dan `backend`. Buka dua terminal terpisah untuk menjalankan keduanya.

### 1. Setup Database (MySQL)

1. Nyalakan server MySQL.
2. jalankan file SQL `educapy.sql` pada folder. Pastikan tabel seperti `user`, `guru`, `murid`, `pendaftaran`, `keahlian`, `tingkat_pendidikan`, `mata_pelajaran`, `jadwal_kesediaan`, `jadwal`, dan `pendaftaran_item` sudah terbuat.
3. buat file `.env` untuk di folder backend untuk menjalankan database di localhost

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=educapy
DB_PORT=3306

JWT_SECRET="secret123!"
```

### 2. Setup Frontend & Backend (Express.js)

Buka terminal dan masuk ke folder `backend`.

```bash
cd backend
npm install
```

Buka terminal dan masuk ke folder `frontend`.

```bash
cd frontend
npm install
```

### 3. cara menjalankan menu murid dan guru

pastikan mySQL menyala
Buka terminal dan masuk ke folder `backend`.
ketik:

```bash
cd backend
npm run dev
```

Buka terminal dan masuk ke folder `frontend`.
ketik:

```bash
cd frontend
npm run dev
```

klik url hasil menjalankan frontend

### 4. cara menjalankan menu admin

pastikan mySQL menyala

Buka terminal dan masuk ke folder `backend`.
ketik:

```bash
cd backend
npm run dev
```

Buka terminal dan masuk ke folder `frontend`.
ketik:

```bash
cd frontend
npm run dev
```

klik url hasil menjalankan frontend kemudian ubah localhost:{port}/admin
