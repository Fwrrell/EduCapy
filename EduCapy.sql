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

    Foreign Key (id_guru) REFERENCES guru(id_guru)
);

CREATE TABLE jadwal (
    id_jadwal INT AUTO_INCREMENT PRIMARY KEY,
    id_kesediaan INT NOT NULL,
    hari_mengajar ENUM('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu') NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

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
INSERT INTO user(nama,role,email,password) VALUES('Doni','guru','Doni@gmail.com','$2a$10$/G5JfjjQYuyLsvfZAhr.Z.yX2YljM1I7pzJvw4fQRahOFBUclRxS.'),
                                                 ('Ivan Kumalala','murid','ivankumalala@gmail.com','$2a$10$/G5JfjjQYuyLsvfZAhr.Z.yX2YljM1I7pzJvw4fQRahOFBUclRxS.');

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
INSERT INTO mata_pelajaran (id_pendidikan, nama) VALUES (12, 'KIMIA');   -- Mapel SMA 3
INSERT INTO mata_pelajaran (id_pendidikan, nama) VALUES (11, 'BIOLOGI'); -- Mapel SMA 2
INSERT INTO mata_pelajaran (id_pendidikan, nama) VALUES (12, 'EKONOMI'); -- Mapel SMA 3




-- 5. KEAHLIAN GURU 

INSERT INTO keahlian(id_guru,id_mapel) VALUES (3,1); -- Agus - Matematika
INSERT INTO keahlian(id_guru,id_mapel) VALUES (5,2); -- Kapi - Fisika
INSERT INTO keahlian(id_guru,id_mapel) VALUES (5,1); -- Kapi - Matematika
INSERT INTO keahlian(id_guru,id_mapel) VALUES (6,3); -- Doni - Bahasa Inggris
INSERT INTO keahlian(id_guru,id_mapel) VALUES (3,4); -- Agus - Kimia
INSERT INTO keahlian(id_guru,id_mapel) VALUES (3,6); -- Agus - Ekonomi
INSERT INTO keahlian(id_guru,id_mapel) VALUES (5,4); -- Kapi - Kimia
INSERT INTO keahlian(id_guru,id_mapel) VALUES (5,5); -- Kapi - Biologi
INSERT INTO keahlian(id_guru,id_mapel) VALUES (6,5); -- Doni - Biologi
INSERT INTO keahlian(id_guru,id_mapel) VALUES (6,6); -- Doni - Ekonomi
INSERT INTO keahlian(id_guru,id_mapel) VALUES (6,2); -- Doni - Fisika






-- 6 masukan jadwal kesediaan guru dengan menggunakan id guru dari tabel guru , id mapel dari tabel mapel
-- Jadwal Kesediaan Asli (ID Kesediaan 1 s.d 5)
INSERT INTO jadwal_kesediaan (id_guru, id_mapel, tanggal_awal_bersedia, tanggal_akhir_bersedia) VALUES
(3,1,'2026-06-01','2026-07-31'),  -- ID 1: Agus - Matematika
(6,3,'2026-06-01','2026-07-31'),  -- ID 2: Doni - B.Inggris
(5,2,'2026-06-01','2026-07-31'),  -- ID 3: Kapi - Fisika
(3,4,'2026-06-01','2026-07-31'),  -- ID 4: Agus - Kimia
(3,6,'2026-06-01','2026-07-31'),  -- ID 5: Agus - Ekonomi
(5,4,'2026-06-01','2026-07-31'),  -- ID 6: Kapi - Kimia
(5,5,'2026-06-01','2026-07-31'),  -- ID 7: Kapi - Biologi
(6,5,'2026-06-01','2026-07-31'),  -- ID 8: Doni - Biologi
(6,6,'2026-06-01','2026-07-31');  -- ID 9: Doni - Ekonomi



-- 7. masukan jadwal lebih spesifik dari jadwal_kesediaan 
-- id_kesediaan lihat dlu di jadwal kesediaan

INSERT INTO jadwal(id_kesediaan, hari_mengajar, jam_mulai, jam_selesai) VALUES
(1,'Rabu','15:00:00','16:00:00'),   -- ID 1
(1,'Senin','14:00:00','16:00:00'),  -- ID 2
(2,'Senin','16:00:00','18:00:00'),  -- ID 3
(2,'Jumat','16:00:00','18:00:00'),  -- ID 4
(3,'Jumat','17:00:00','18:00:00'),  -- ID 5
(3,'Rabu','13:00:00','15:00:00'),   -- ID 6 (Hari biasa untuk Fisika)
(3,'Kamis','13:00:00','15:00:00'),  -- ID 7 (Untuk slot 11 Juni)   semuanya punya KAPI
(3,'Sabtu','08:00:00','10:00:00'),  -- ID 8 (Untuk slot 6 & 13 Juni)
(4,'Senin','08:00:00','10:00:00'),  -- ID 9
(4,'Selasa','10:00:00','12:00:00'), -- ID 10
(5,'Selasa','09:00:00','11:00:00'), -- ID 11
(5,'Sabtu','11:00:00','13:00:00'),  -- ID 12
(6,'Rabu','10:00:00','12:00:00'),   -- ID 13
(7,'Kamis','13:00:00','15:00:00'),  -- ID 14
(7,'Kamis','15:00:00','17:00:00'),  -- ID 15
(8,'Jumat','14:00:00','16:00:00'),  -- ID 16
(9,'Sabtu','08:00:00','10:00:00');  -- ID 17


-- 8 insert into Pendaftaran . lihat ke tabel murid id muridnya
-- lihat id murid yang mau didaftarkan

INSERT INTO pendaftaran(id_murid) VALUES
(7);
INSERT INTO pendaftaran(id_murid) VALUES
(2);
INSERT INTO pendaftaran(id_murid) VALUES
(4);

-- 9 insert ke pendaftaran item, id_daftar lihat dari tabel pendaftaran,id jadwal lihat ke tabel jadwal, id mapel lihat ke tabel mapel

SELECT * FROM pendaftaran_item;

INSERT INTO pendaftaran_item (id_daftar, id_jadwal, id_mapel, tanggal_mulai, tanggal_selesai, jam_mulai_les, jam_selesai_les, status, catatan) VALUES 
(1, 1, 1, '2026-06-03', '2026-06-03', '15:00:00','16:00:00', 'Selesai', 'Materi Logaritma Dasar - Selesai dilaksanakan'),
(2, 2, 1, '2026-06-01', '2026-06-01', '14:00:00','16:00:00', 'Selesai', 'Pembahasan PR Aljabar - Selesai'),
(1, 8, 2, '2026-06-06', '2026-06-06', '08:00:00','10:00:00', 'Selesai', 'John Doe - Teori Kinetik Gas (Sesi Hari Ini Pagi - SELESAI)'),

(2, 6, 2, '2026-06-01', '2026-07-31', '13:00:00', '15:00:00', 'Mendatang', 'John Doe - Teori Kinetik Gas (Reguler Juni-Juli)'), -- STATUS: MENDATANG (Sesi masa depan, termasuk request tanggal 11 & 13 Juni Anda)
(2, 7, 2, '2026-06-11', '2026-06-11', '13:00:00', '15:00:00', 'Mendatang', 'John Doe - Teori Kinetik Gas (Sesi Khusus Kamis 11 Juni)'),
(2, 8, 2, '2026-06-13', '2026-06-13', '08:00:00', '10:00:00', 'Mendatang', 'John Doe - Teori Kinetik Gas (Sesi Khusus Sabtu 13 Juni)'),
(1, 9, 4, '2026-06-15', '2026-07-31', '08:00:00', '10:00:00', 'Mendatang', 'Ivan - Les Privat Kimia Intensif'),
(3, 4, 3, '2026-06-12', '2026-07-31', '16:00:00', '18:00:00', 'Mendatang', 'Hansel - English Academic Reading'),

(1, 10, 4, '2026-06-02', '2026-06-02', '10:00:00', '12:00:00', 'Batal', 'Ivan - Praktikum Kimia (Dibatalkan karena guru sakit)'), -- STATUS: BATAL (Contoh kelas yang di-cancel)
(3, 12, 6, '2026-06-06', '2026-06-06', '11:00:00', '13:00:00', 'Batal', 'Hansel - Studi Kasus Pasar Modal (Murid izin acara keluarga)');

