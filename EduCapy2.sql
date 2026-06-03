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
INSERT INTO user(nama,role,email,password) VALUES('John Doe','murid','JohnDoe@gmail.com','$2a$10$/G5JfjjQYuyLsvfZAhr.Z.yX2YljM1I7pzJvw4fQRahOFBUclRxS.');
INSERT INTO user(nama,role,email,password) VALUES('Agus','guru','Agus@gmail.com','$2a$10$/G5JfjjQYuyLsvfZAhr.Z.yX2YljM1I7pzJvw4fQRahOFBUclRxS.');
INSERT INTO user(nama,role,email,password) VALUES('Hansel','murid','Hansel@gmail.com','$2a$10$/G5JfjjQYuyLsvfZAhr.Z.yX2YljM1I7pzJvw4fQRahOFBUclRxS.');
INSERT INTO user(nama,role,email,password) VALUES('Kapi','guru','Kapi@gmail.com','$2a$10$/G5JfjjQYuyLsvfZAhr.Z.yX2YljM1I7pzJvw4fQRahOFBUclRxS.');
INSERT INTO user(nama,role,email,password) VALUES('Doni','guru','Doni@gmail.com','$2a$10$/G5JfjjQYuyLsvfZAhr.Z.yX2YljM1I7pzJvw4fQRahOFBUclRxS.'),('Ivan Kumalala','murid','ivankumalala@gmail.com','');

-- 2 masukan ke tabel murid menghubungkan id_murid dengan id_pendidikan
insert into murid(id_murid,id_pendidikan) VALUES(2,10);-- id murid mengikuti id user lihat dlu tabel user 
insert into murid(id_murid,id_pendidikan) VALUES(4,12);
INSERT into murid(id_murid,id_pendidikan) VALUES(7,9);

-- 3 masukan data spesifik guru lihat dari tabel user
INSERT INTO guru(id_guru,pendidikan) VALUES
(3,"S1 Teknik Informatika , Universitas Katolik Parahyangan"),(5,"S2 Metalurgi Institut Teknologi Bandung");

INSERT INTO guru(id_guru,pendidikan) VALUES
(6,"S1 Ekonomi ,Universitas Indonesia");
-- id guru bs berbeda jika sempat menghapus user yang lain

-- 4. masukan data mata_pelajaran dengan id pendidikan = di table murid
INSERT INTO mata_pelajaran (id_pendidikan,nama) VALUES(12,'MATEMATIKA');
INSERT INTO mata_pelajaran (id_pendidikan, nama) VALUES (10, 'FISIKA');
INSERT into mata_pelajaran(id_pendidikan,nama) VALUES (9,'BAHASA INGGRIS');

-- 5. tentukan keahlian Guru lihat dengan tabel guru untuk id guru, tabel mapel dengan id mapel

INSERT INTO keahlian(id_guru,id_mapel) VALUES
(3,1),(5,2);
INSERT INTO keahlian(id_guru,id_mapel) VALUES
(5,1);
INSERT INTO keahlian(id_guru,id_mapel) VALUES
(6,3);

-- 6 masukan jadwal kesediaan guru dengan menggunakan id guru dari tabel guru , id mapel dari tabel mapel

INSERT INTO jadwal_kesediaan (id_guru, id_mapel, tanggal_awal_bersedia, tanggal_akhir_bersedia) VALUES
(3,1,'2026-01-01','2026-01-31'),(6,3,'2026-01-01','2026-01-31'),(3,1,'2026-02-01','2026-03-31');
INSERT INTO jadwal_kesediaan (id_guru, id_mapel, tanggal_awal_bersedia, tanggal_akhir_bersedia) VALUES
(5,2,'2026-01-01','2026-05-31'),(5,1,'2026-01-01','2026-03-31');

-- 7. masukan jadwal lebih spesifik dari jadwal_kesediaan 
-- id_kesediaan lihat dlu di jadwal kesediaan

INSERT INTO jadwal(id_kesediaan, hari_mengajar, jam_mulai, jam_selesai) VALUES
(1,'Rabu','15:00:00','16:00:00'),(2,'Senin','16:00:00','18:00:00');
INSERT INTO jadwal(id_kesediaan, hari_mengajar, jam_mulai, jam_selesai) VALUES
(3,'Rabu','17:00:00','18:00:00');
INSERT INTO jadwal(id_kesediaan, hari_mengajar, jam_mulai, jam_selesai) VALUES
(4,'Jumat','17:00:00','18:00:00');

INSERT INTO jadwal(id_kesediaan, hari_mengajar, jam_mulai, jam_selesai) VALUES
(5,'Senin','11:00:00','12:00:00');

-- 8 insert into Pendaftaran . lihat ke tabel murid id muridnya
-- lihat id murid yang mau didaftarkan

INSERT INTO pendaftaran(id_murid) VALUES
(7);
INSERT INTO pendaftaran(id_murid) VALUES
(2);
INSERT INTO pendaftaran(id_murid) VALUES
(4);

-- 9 insert ke pendaftaran item, id_daftar lihat dari tabel pendaftaran,id jadwal lihat ke tabel jadwal, id mapel lihat ke tabel mapel

SELECT * FROM mata_pelajaran;
INSERT INTO pendaftaran_item 
(id_daftar, id_jadwal, id_mapel, tanggal_mulai, tanggal_selesai, jam_mulai_les, jam_selesai_les, status, catatan)
VALUES 
(1, 1, 1, '2026-01-01', '2026-01-01', '15:00:00','16:00:00', 'Mendatang', 'Persiapan Ujian Tengah Semester');
INSERT INTO pendaftaran_item 
(id_daftar, id_jadwal, id_mapel, tanggal_mulai, tanggal_selesai, jam_mulai_les, jam_selesai_les, status, catatan)
VALUES 
(2, 3, 2, '2026-01-01', '2026-01-01', '17:00:00','18:00:00', 'Mendatang', 'Persiapan Ujian Tengah Semester');

INSERT INTO pendaftaran_item 
(id_daftar, id_jadwal, id_mapel, tanggal_mulai, tanggal_selesai, jam_mulai_les, jam_selesai_les, status, catatan)
VALUES 
(2, 2, 2, '2026-02-01', '2026-02-01', '17:00:00','18:00:00', 'Mendatang', 'Persiapan Ujian Tengah Semester');

INSERT INTO pendaftaran_item 
(id_daftar, id_jadwal, id_mapel, tanggal_mulai, tanggal_selesai, jam_mulai_les, jam_selesai_les, status, catatan)
VALUES 
(3, 4, 3, '2026-02-07', '2026-02-21', '17:00:00','18:00:00', 'Mendatang', 'Persiapan Ujian Tengah Semester');


INSERT INTO pendaftaran_item 
(id_daftar, id_jadwal, id_mapel, tanggal_mulai, tanggal_selesai, jam_mulai_les, jam_selesai_les, status, catatan)
VALUES 
(3, 3, 1, '2026-02-07', '2026-02-08', '17:00:00','18:00:00', 'Mendatang', 'Persiapan Ujian Tengah Semester');

INSERT INTO pendaftaran_item 
(id_daftar, id_jadwal, id_mapel, tanggal_mulai, tanggal_selesai, jam_mulai_les, jam_selesai_les, status, catatan)
VALUES 
(2, 2, 2, '2026-02-07', '2026-02-21', '16:00:00','18:00:00', 'Mendatang', 'Persiapan Ujian Tengah Semester');

SET FOREIGN_KEY_CHECKS = 0;

-- 2. Kosongkan seluruh tabel dan reset Auto Increment ke 1
TRUNCATE TABLE pendaftaran_item;
TRUNCATE TABLE pendaftaran;
TRUNCATE TABLE jadwal;
TRUNCATE TABLE jadwal_kesediaan;
TRUNCATE TABLE keahlian;
TRUNCATE TABLE mata_pelajaran;
TRUNCATE TABLE murid;
TRUNCATE TABLE guru;
TRUNCATE TABLE tingkat_pendidikan;
TRUNCATE TABLE user;

-- 3. Nyalakan kembali pengecekan Foreign Key (WAJIB!)
SET FOREIGN_KEY_CHECKS = 1;


INSERT INTO user(id_user, nama, role, email, password, alamat) VALUES
(1, 'superadmin', 'admin', 'admin@educapy.com', '$2b$10$/m5cv1mhM4dB3UZrp.b3NeeInMz2JIxrgQq2BpopO.zYgc4Ify.JW', '-'),
(2, 'John Doe', 'murid', 'JohnDoe@gmail.com', '12345', 'Jl. Setiabudi'),
(3, 'Agus', 'guru', 'Agus@gmail.com', '12345', 'Jl. Ciumbuleuit'),
(4, 'Hansel', 'murid', 'Hansel@gmail.com', '12345', 'Jl. Dipatiukur'),
(5, 'Kapi', 'guru', 'Kapi@gmail.com', '12345', 'Jl. Dago'),
(6, 'Doni', 'guru', 'Doni@gmail.com', '12345', 'Jl. Merdeka'),
(7, 'Ivan Kumalala', 'murid', 'ivankumalala@gmail.com', '12345', 'Jl. Sudirman');

-- DUMMY MURID & GURU
INSERT INTO murid(id_murid, id_pendidikan) VALUES (2,10), (4,12), (7,9);
INSERT INTO guru(id_guru, pendidikan) VALUES 
(3, 'S1 Teknik Informatika, UNPAR'), 
(5, 'S2 Metalurgi, ITB'), 
(6, 'S1 Ekonomi, UI');

-- DUMMY MATA PELAJARAN & KEAHLIAN
INSERT INTO mata_pelajaran (id_mapel, id_pendidikan, nama) VALUES 
(1, 12, 'MATEMATIKA'), (2, 10, 'FISIKA'), (3, 9, 'BAHASA INGGRIS');
INSERT INTO keahlian(id_guru, id_mapel) VALUES (3,1), (5,2), (5,1), (6,3);

-- DUMMY JADWAL KESEDIAAN & JADWAL HARIAN
INSERT INTO jadwal_kesediaan (id_kesediaan, id_guru, id_mapel, tanggal_awal_bersedia, tanggal_akhir_bersedia) VALUES
(1, 3, 1, '2026-01-01', '2026-01-31'),
(2, 6, 3, '2026-01-01', '2026-01-31'),
(3, 3, 1, '2026-02-01', '2026-03-31'),
(4, 5, 2, '2026-01-01', '2026-05-31'),
(5, 5, 1, '2026-01-01', '2026-03-31');

INSERT INTO jadwal(id_jadwal, id_kesediaan, hari_mengajar, jam_mulai, jam_selesai) VALUES
(1, 1, 'Rabu', '15:00:00', '16:00:00'),
(2, 2, 'Senin', '16:00:00', '18:00:00'),
(3, 3, 'Rabu', '17:00:00', '18:00:00'),
(4, 4, 'Jumat', '17:00:00', '18:00:00'),
(5, 5, 'Senin', '11:00:00', '12:00:00');

-- DUMMY PENDAFTARAN & ITEM (Transaksi)
INSERT INTO pendaftaran(id_daftar, id_murid) VALUES (1, 7), (2, 2), (3, 4);

INSERT INTO pendaftaran_item (id_pendItem, id_daftar, id_jadwal, id_mapel, tanggal_mulai, tanggal_selesai, jam_mulai_les, jam_selesai_les, status, catatan) VALUES 
(1, 1, 1, 1, '2026-01-01', '2026-01-01', '15:00:00', '16:00:00', 'Mendatang', 'Persiapan UTS'),
(2, 2, 3, 2, '2026-01-01', '2026-01-01', '17:00:00', '18:00:00', 'Mendatang', 'Persiapan UTS'),
(3, 2, 2, 2, '2026-02-01', '2026-02-01', '17:00:00', '18:00:00', 'Mendatang', 'Persiapan UTS'),
(4, 3, 4, 3, '2026-02-07', '2026-02-21', '17:00:00', '18:00:00', 'Mendatang', 'Persiapan UTS'),
(5, 3, 3, 1, '2026-02-07', '2026-02-08', '17:00:00', '18:00:00', 'Selesai', 'Materi Aljabar'),
(6, 2, 2, 2, '2026-02-07', '2026-02-21', '16:00:00', '18:00:00', 'Batal', 'Guru berhalangan');