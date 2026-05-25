-- CREATE DATABASE IF NOT EXISTS educapy;
-- USE educapy;

DROP TABLE IF EXISTS pendaftaran_item;
DROP TABLE IF EXISTS pendaftaran;
DROP TABLE IF EXISTS jadwal;
DROP TABLE IF EXISTS jadwal_kesediaan;
DROP TABLE IF EXISTS keahlian;
DROP TABLE IF EXISTS mata_pelajaran;
DROP TABLE IF EXISTS guru;
DROP TABLE IF EXISTS murid;
DROP TABLE IF EXISTS tingkat_pendidikan;
DROP TABLE IF EXISTS user;

CREATE TABLE user (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    role ENUM('admin', 'guru', 'murid') NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    alamat TEXT
);

CREATE TABLE tingkat_pendidikan (
    id_pendidikan INT AUTO_INCREMENT PRIMARY KEY,
    jenjang VARCHAR(50) NOT NULL,
    tingkat INT NOT NULL
);

CREATE TABLE murid (
    id_murid INT PRIMARY KEY,
    id_pendidikan INT,

    Foreign Key (id_murid) REFERENCES user(id_user) ON DELETE CASCADE,
    Foreign Key (id_pendidikan) REFERENCES tingkat_pendidikan(id_pendidikan)
);

CREATE TABLE guru (
    id_guru INT PRIMARY KEY,
    pendidikan TEXT,

    Foreign Key (id_guru) REFERENCES user(id_user) ON DELETE CASCADE
);

CREATE TABLE mata_pelajaran (
    id_mapel INT AUTO_INCREMENT PRIMARY KEY,
    id_pendidikan INT,
    nama VARCHAR(100) NOT NULL,

    Foreign Key (id_pendidikan) REFERENCES tingkat_pendidikan(id_pendidikan)
);

CREATE TABLE keahlian (
    id_guru INT,
    id_mapel INT,

    PRIMARY KEY (id_guru, id_mapel),
    Foreign Key (id_guru) REFERENCES guru(id_guru) ON DELETE CASCADE,
    Foreign Key (id_mapel) REFERENCES mata_pelajaran(id_mapel) ON DELETE CASCADE
);

CREATE TABLE jadwal_kesediaan (
    id_kesediaan INT AUTO_INCREMENT PRIMARY KEY,
    id_guru INT,
    id_mapel INT,
    tanggal_awal_bersedia DATE,
    tanggal_akhir_bersedia DATE,

    Foreign Key (id_guru) REFERENCES guru(id_guru)
);

CREATE TABLE jadwal (
    id_jadwal INT AUTO_INCREMENT PRIMARY KEY,
    id_kesediaan INT NOT NULL,
    hari_mengajar ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu') NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,

    Foreign Key (id_kesediaan) REFERENCES jadwal_kesediaan(id_kesediaan) ON DELETE CASCADE
);

CREATE TABLE pendaftaran (
    id_daftar INT AUTO_INCREMENT PRIMARY KEY,
    id_murid INT NOT NULL,

    Foreign Key (id_murid) REFERENCES murid(id_murid) ON DELETE CASCADE
);

CREATE TABLE pendaftaran_item (
    id_pendItem INT AUTO_INCREMENT PRIMARY KEY,
    id_daftar INT NOT NULL,
    id_jadwal INT NOT NULL,
    id_mapel INT NOT NULL,
    tanggal_mulai DATE NOT NULL,
    tanggal_selesai DATE NOT NULL,
    jam_mulai_les TIME NOT NULL,
    jam_selesai_les TIME NOT NULL,
    status ENUM('Mendatang', 'Selesai', 'Batal'),
    catatan TEXT,

    Foreign Key (id_daftar) REFERENCES pendaftaran(id_daftar) ON DELETE CASCADE,
    Foreign Key (id_jadwal) REFERENCES jadwal(id_jadwal) ON DELETE CASCADE,
    Foreign Key (id_mapel) REFERENCES mata_pelajaran(id_mapel) ON DELETE CASCADE
);

INSERT INTO user (nama, role, email, password)
VALUES ('superadmin', 'admin', 'admin@educapy.com', '$2b$10$/m5cv1mhM4dB3UZrp.b3NeeInMz2JIxrgQq2BpopO.zYgc4Ify.JW')

INSERT INTO tingkat_pendidikan (jenjang, tingkat)
VALUES
('SD', 1),
('SD', 2),
('SD', 3),
('SD', 4),
('SD', 5),
('SD', 6),
('SMP', 1),
('SMP', 2),
('SMP', 3),
('SMA', 1),
('SMA', 2),
('SMA', 3);

-- DUMMY DATA
INSERT INTO pendaftaran (id_daftar, id_murid) VALUES (1, 4);
INSERT INTO mata_pelajaran (id_mapel, id_pendidikan, nama) VALUES (1, 21, 'MATEMATIKA');
INSERT INTO pendaftaran_item 
(id_daftar, id_jadwal, id_mapel, tanggal_mulai, tanggal_selesai, jam_mulai_les, jam_selesai_les, status, catatan)
VALUES 
(1, 1, 1, '2026-06-01', '2026-06-30', '08:00:00', '09:00:00', 'Mendatang', 'Persiapan Ujian Tengah Semester');
INSERT INTO keahlian VALUES (8, 1);