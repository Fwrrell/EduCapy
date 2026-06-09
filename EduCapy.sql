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
    alamat TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tingkat_pendidikan (
    id_pendidikan INT AUTO_INCREMENT PRIMARY KEY,
    jenjang VARCHAR(50) NOT NULL,
    tingkat INT NOT NULL,
    
    UNIQUE KEY uq_pendidikan  (jenjang, tingkat)  -- Memastikan kombinasi jenjang dan tingkat unik (tidak ada duplikat 'SMA Kelas 3' dua kali)
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    Foreign Key (id_guru) REFERENCES guru(id_guru),
   
    CONSTRAINT chk_tanggal_kesediaan CHECK (tanggal_akhir_bersedia >= tanggal_awal_bersedia)  --  Constraint: Tanggal akhir tidak boleh mendahului tanggal awal
);

CREATE TABLE jadwal (
    id_jadwal INT AUTO_INCREMENT PRIMARY KEY,
    id_kesediaan INT NOT NULL,
    hari_mengajar ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu') NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    Foreign Key (id_kesediaan) REFERENCES jadwal_kesediaan(id_kesediaan) ON DELETE CASCADE,
 
    CONSTRAINT chk_jam_mengajar CHECK (jam_selesai > jam_mulai)    --  Constraint: Jam selesai les harus setelah jam mulai les
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    Foreign Key (id_daftar) REFERENCES pendaftaran(id_daftar) ON DELETE CASCADE,
    Foreign Key (id_jadwal) REFERENCES jadwal(id_jadwal) ON DELETE CASCADE,
    Foreign Key (id_mapel) REFERENCES mata_pelajaran(id_mapel) ON DELETE CASCADE,
   
    CONSTRAINT chk_tanggal_les CHECK (tanggal_selesai >= tanggal_mulai),  -- Constraints logika waktu transaksi
    CONSTRAINT chk_jam_les CHECK (jam_selesai_les > jam_mulai_les)
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
INSERT INTO user(nama,role,email,password) VALUES('Doni','guru','Doni@gmail.com','$2a$10$/G5JfjjQYuyLsvfZAhr.Z.yX2YljM1I7pzJvw4fQRahOFBUclRxS.'),
                                                 ('Ivan Kumalala','murid','ivankumalala@gmail.com','$2a$10$/G5JfjjQYuyLsvfZAhr.Z.yX2YljM1I7pzJvw4fQRahOFBUclRxS.');

insert into murid(id_murid,id_pendidikan) VALUES(2,10); 
insert into murid(id_murid,id_pendidikan) VALUES(4,12);
INSERT into murid(id_murid,id_pendidikan) VALUES(7,9);

INSERT INTO guru(id_guru,pendidikan) VALUES
(3,"S1 Teknik Informatika , Universitas Katolik Parahyangan"),(5,"S2 Metalurgi Institut Teknologi Bandung");
INSERT INTO guru(id_guru,pendidikan) VALUES
(6,"S1 Ekonomi ,Universitas Indonesia");


-- MATA PELAJARAN
INSERT INTO mata_pelajaran (id_pendidikan, nama) VALUES
(10, 'Matematika'),
(10, 'Fisika'),
(10, 'Kimia'),
(10, 'Bahasa Inggris'),
(12, 'Matematika'),
(12, 'Fisika'),
(12, 'Kimia'),
(12, 'Biologi'),
(12, 'Ekonomi'),
(9, 'Matematika'),
(9, 'IPA'),
(9, 'Bahasa Inggris'),
(9, 'Bahasa Indonesia');

-- KEAHLIAN GURU 
-- Agus (ID 3): Matematika, Fisika
-- Kapi (ID 5): Fisika, Kimia, Biologi, IPA
-- Doni (ID 6): Ekonomi, Bahasa Inggris, Bahasa Indonesia
INSERT INTO keahlian(id_guru, id_mapel) VALUES 
(3,1), (3,5), (3,2), (3,6), (3,10),
(5,2), (5,6), (5,3), (5,7), (5,8), (5,11),
(6,4), (6,9), (6,12), (6,13);

-- JADWAL KESEDIAAN GURU (min mengajar 1 bulan)
INSERT INTO jadwal_kesediaan (id_kesediaan, id_guru, id_mapel, tanggal_awal_bersedia, tanggal_akhir_bersedia) VALUES
(1, 3, 1, '2026-05-15', '2026-08-15'), -- Agus - Math SMA 1 (3 Bulan)
(2, 3, 5, '2026-06-01', '2026-07-31'), -- Agus - Math SMA 3 (2 Bulan)
(3, 5, 2, '2026-05-01', '2026-06-30'), -- Kapi - Fisika SMA 1 (2 Bulan)
(4, 5, 6, '2026-06-01', '2026-07-15'), -- Kapi - Fisika SMA 3 (1.5 Bulan)
(5, 5, 11, '2026-05-20', '2026-08-20'), -- Kapi - IPA SMP 3 (3 Bulan)
(6, 6, 9, '2026-06-01', '2026-08-01'), -- Doni - Ekonomi SMA 3 (2 Bulan)
(7, 6, 12, '2026-05-10', '2026-07-10'); -- Doni - B.Inggris SMP 3 (2 Bulan)

-- JADWAL (SLOT WAKTU)
INSERT INTO jadwal(id_jadwal, id_kesediaan, hari_mengajar, jam_mulai, jam_selesai) VALUES
-- Slot Agus (Math)
(1, 1, 'Senin', '14:00:00', '16:00:00'),
(2, 1, 'Rabu', '14:00:00', '16:00:00'),
(3, 2, 'Selasa', '10:00:00', '12:00:00'),
(4, 2, 'Jumat', '10:00:00', '12:00:00'),
-- Slot Kapi (Fisika/IPA)
(5, 3, 'Senin', '16:00:00', '18:00:00'),
(6, 3, 'Kamis', '13:00:00', '15:00:00'),
(7, 4, 'Jumat', '13:00:00', '15:00:00'),
(8, 5, 'Rabu', '16:00:00', '18:00:00'),
(9, 5, 'Jumat', '16:00:00', '18:00:00'),
-- Slot Doni (Ekonomi/B.Inggris)
(10, 6, 'Sabtu', '08:00:00', '10:00:00'),
(11, 6, 'Kamis', '15:00:00', '17:00:00'),
(12, 7, 'Senin', '08:00:00', '10:00:00'),
(13, 7, 'Jumat', '08:00:00', '10:00:00');

-- PENDAFTARAN 
INSERT INTO pendaftaran(id_daftar, id_murid) VALUES
(1, 2), (2, 4), (3, 7);

-- PENDAFTARAN ITEM
INSERT INTO pendaftaran_item (id_daftar, id_jadwal, id_mapel, tanggal_mulai, tanggal_selesai, jam_mulai_les, jam_selesai_les, status) VALUES
-- DATA KONTRAK (mingguan/bulanan)
(1, 1, 1, '2026-06-01', '2026-06-30', '14:00:00', '16:00:00', 'Selesai'),    -- Kontrak Math SMA 1 (Bulan Juni)
(2, 3, 5, '2026-06-01', '2026-06-15', '10:00:00', '12:00:00', 'Selesai'),    -- Kontrak Math SMA 3 (2 Minggu awal Juni)
(3, 12, 12, '2026-06-01', '2026-06-30', '08:00:00', '10:00:00', 'Selesai'),  -- Kontrak B.Inggris (Full Juni)
(1, 6, 2, '2026-06-04', '2026-06-25', '13:00:00', '15:00:00', 'Selesai')    -- Kontrak Fisika (Setiap Kamis di Juni)

INSERT INTO pendaftaran_item (id_daftar, id_jadwal, id_mapel, tanggal_mulai, tanggal_selesai, jam_mulai_les, jam_selesai_les, status) VALUES
-- DATA HARIAN/SESI TUNGGAL 
(3, 8, 11, '2026-06-03', '2026-06-03', '16:00:00', '18:00:00', 'Selesai'),
(2, 11, 9, '2026-06-04', '2026-06-04', '15:00:00', '17:00:00', 'Selesai')

INSERT INTO pendaftaran_item (id_daftar, id_jadwal, id_mapel, tanggal_mulai, tanggal_selesai, jam_mulai_les, jam_selesai_les, status) VALUES
-- DATA KONTRAK AKTIF 
(3, 13, 12, '2026-06-12', '2026-06-12', '08:00:00', '10:00:00', 'Mendatang'), -- Sesi harian demo
(2, 4, 5, '2026-06-01', '2026-06-30', '10:00:00', '12:00:00', 'Mendatang'),   -- Kontrak Aktif Juni (Math SMA 3)
(1, 7, 6, '2026-06-01', '2026-06-21', '13:00:00', '15:00:00', 'Mendatang'),   -- Kontrak 3 Minggu (Fisika SMA 3)
(3, 9, 11, '2026-06-05', '2026-07-05', '16:00:00', '18:00:00', 'Mendatang')  -- Kontrak 1 Bulan (IPA SMP 3)

INSERT INTO pendaftaran_item (id_daftar, id_jadwal, id_mapel, tanggal_mulai, tanggal_selesai, jam_mulai_les, jam_selesai_les, status) VALUES
-- DATA MENDATANG KONTRAK
(2, 10, 9, '2026-06-13', '2026-07-13', '08:00:00', '10:00:00', 'Mendatang'),  -- Kontrak Ekonomi (Bulan Juli)
(1, 1, 1, '2026-07-01', '2026-07-31', '14:00:00', '16:00:00', 'Mendatang'),  -- Perpanjangan Kontrak Math
(3, 12, 12, '2026-07-01', '2026-07-15', '08:00:00', '10:00:00', 'Mendatang');

INSERT INTO pendaftaran_item (id_daftar, id_jadwal, id_mapel, tanggal_mulai, tanggal_selesai, jam_mulai_les, jam_selesai_les, status) VALUES
-- SESI BATAL
(2, 3, 5, '2026-06-03', '2026-06-03', '10:00:00', '12:00:00', 'Batal'),
(1, 5, 2, '2026-06-01', '2026-06-01', '16:00:00', '18:00:00', 'Batal');

-- doni (6) keahlian matematika SMA - 1 (1)
INSERT INTO keahlian (Id_guru, Id_mapel) VALUES 
(6, 1); 


INSERT INTO jadwal_kesediaan (id_kesediaan, id_guru, id_mapel, tanggal_awal_bersedia, tanggal_akhir_bersedia) VALUES
(8, 6, 1, '2026-08-16', '2026-10-15'); -- Doni - Matematika SMA 1

INSERT INTO jadwal (id_jadwal, id_kesediaan, hari_mengajar, jam_mulai, jam_selesai) VALUES
(14, 8, 'Senin', '14:00:00', '16:00:00'); -- Doni - Senin, 14:00 - 16:00

