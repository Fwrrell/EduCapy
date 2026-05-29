CREATE DATABASE IF NOT EXISTS educapy;
USE educapy;

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
VALUES ('superadmin', 'admin', 'admin@educapy.com', '$2b$10$/m5cv1mhM4dB3UZrp.b3NeeInMz2JIxrgQq2BpopO.zYgc4Ify.JW');
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
INSERT INTO user (nama, role, email, password, alamat) VALUES 
('Bapak Budi Santoso', 'guru', 'budi@educapy.com', '12345', 'Jl. Pendidikan No 1'),
('Prospero Phelix', 'murid', 'prospero@educapy.com', '12345', 'Jl. Merdeka No 45');

INSERT INTO guru (id_guru, pendidikan) VALUES (2, 'S1 Pendidikan Matematika');
-- Kita pasangkan murid dengan id_pendidikan = 7 (SMP Kelas 1 dari tingkat_pendidikan)
INSERT INTO murid (id_murid, id_pendidikan) VALUES (3, 7); 

-- Buat Mata Pelajaran untuk id_pendidikan = 7
INSERT INTO mata_pelajaran (id_mapel, id_pendidikan, nama) VALUES (1, 7, 'MATEMATIKA SMP');

INSERT INTO keahlian (id_guru, id_mapel) VALUES (2, 1);

INSERT INTO jadwal_kesediaan (id_kesediaan, id_guru, id_mapel, tanggal_awal_bersedia, tanggal_akhir_bersedia) 
VALUES (1, 2, 1, '2026-06-01', '2026-12-31');

INSERT INTO jadwal (id_jadwal, id_kesediaan, hari_mengajar, jam_mulai, jam_selesai) 
VALUES (1, 1, 'Senin', '09:00:00', '10:00:00');

INSERT INTO pendaftaran (id_daftar, id_murid) VALUES (1, 3);

INSERT INTO pendaftaran_item 
(id_pendItem, id_daftar, id_jadwal, id_mapel, tanggal_mulai, tanggal_selesai, jam_mulai_les, jam_selesai_les, status, catatan)
VALUES 
(1, 1, 1, 1, '2026-06-01', '2026-06-30', '09:00:00', '10:00:00', 'Mendatang', 'Persiapan Ujian Kenaikan Kelas');

INSERT INTO user(nama, role, email, password, alamat) VALUES
('Bobi Putra, S.T.', 'guru', 'Bobob@gmail.com', '12345', 'jalan merdeka no. 12'),
('Rayhan Saputra, S.T.', 'guru', 'rayhan@gmail.com', '12345', 'jalan kopo no. 12'),
('Jose Jonathan, S.Si.', 'guru', 'jose@gmail.com', '12345', 'jalan ahmad yani no. 12'),
('rani rigani, S.E.', 'guru', 'rani@gmail.com', '12345', 'jalan merdeka no. 12')

INSERT INTO mata_pelajaran(id_mapel, id_pendidikan, nama) VALUES (2, 12, 'FISIKA SMA'),
(3, 10, "MATEMATIKA GEOMETRI")

INSERT INTO mata_pelajaran(id_mapel, id_pendidikan, nama) VALUES(4, 8, "KIMIA SMP"), (5, 9, "MATEMATIKA LANJUT"), (6, 11, "FISIKA STRUKTUR"), (7, 11, "akuntansi dasar");
INSERT INTO guru (id_guru, pendidikan) VALUES(5, 'S1 FISIKA'), ('6', "S2 KIMIA"), (7, 'S1 MATEMATIKA'), (8, 'S2 Ekonomi');
INSERT INTO keahlian(id_guru, id_mapel) VALUES (5, 6), (6, 4), (7, 5),  (8, 7);

INSERT INTO jadwal_kesediaan (id_kesediaan, id_guru, id_mapel, tanggal_awal_bersedia, tanggal_akhir_bersedia) 
VALUES (2, 5, 6, '2026-06-02', '2026-10-31'), (3, 6, 4, '2026-08-15', '2026-11-31'), (4, 7, 5, '2026-10-15', '2026-12-31'), (5, 8, 7, '2026-08-15', '2026-11-31');

INSERT INTO jadwal (id_jadwal, id_kesediaan, hari_mengajar, jam_mulai, jam_selesai) 
VALUES (2, 2, 'Senin', '09:00:00', '10:00:00'), (3,2, 'Selasa', '09:00:00', '10:00:00'), (4,2, 'Selasa', '10:00:00', '11:00:00'), (5,2, 'Selasa', '13:00:00', '14:00:00'), (6,2, 'Selasa', '17:00:00', '18:00:00'),(7,2, 'Rabu', '09:00:00', '10:00:00'), (8, 3,'Senin', '09:00:00', '10:00:00'), (9, 3, 'Selasa', '08:00:00', '09:00:00'), (10, 3, 'Selasa', '09:00:00', '10:00:00'), (11, 3, 'Selasa', '11:00:00', '12:00:00'),
(12, 4, 'Selasa', '09:00:00', '10:00:00'), (13, 4, 'Rabu', '09:00:00', '10:00:00'), (14, 4, 'Selasa', '11:00:00', '12:00:00'), (15, 4, 'Kamis', '11:00:00', '12:00:00');

