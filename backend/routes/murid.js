const express = require("express");
const router = express.Router();
const db = require("../config/db");

const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/tingkat-pendidikan", async (req, res) => {
  try {
    const query = "SELECT * FROM tingkat_pendidikan";
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

router.get("/cari-guru", async (req, res) => {
  const query = `
    SELECT
      u.Id_user AS id,
      u.nama,
      GROUP_CONCAT(mp.nama SEPARATOR ', ') AS matapelajaran
    FROM user u
    JOIN guru g ON u.Id_user = g.Id_guru
    LEFT JOIN keahlian k ON g.Id_guru = k.Id_guru
    LEFT JOIN mata_pelajaran mp ON k.Id_mapel = mp.Id_mapel
    WHERE u.role = 'guru'
    GROUP BY u.Id_user, u.nama
  `;

  try {
    const [results] = await db.query(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Gagal mengambil data guru:", err);
    return res.status(500).json({ error: "Gagal mengambil data dari server" });
  }
});

router.get("/jadwal/:id_guru", async (req, res) => {
  const idGuru = req.params.id_guru;
  const query = `
    SELECT
      jadwal.id_jadwal, 
      jadwal.hari_mengajar,
      jadwal.jam_mulai,
      jadwal.jam_selesai
    FROM jadwal_kesediaan
    JOIN jadwal ON jadwal.id_kesediaan = jadwal_kesediaan.id_kesediaan
    WHERE jadwal_kesediaan.id_guru= ?
  `;
  try {
    const [results] = await db.query(query, [idGuru]);
    res.status(200).json(results);
  } catch (err) {
    console.error("gagal mengambil jadwal:", err);
    return res.status(500).json({ error: "gagal mengambil data jadwal" });
  }
});

router.post("/booking", verifyToken, async (req, res) => {
  const id_murid = req.user.id_user;

  const { id_jadwal, nama_mapel, tanggal_mulai, tanggal_selesai } = req.body;

  if (!id_jadwal || !nama_mapel || !tanggal_mulai || !tanggal_selesai) {
    return res
      .status(400)
      .json({ message: "Lengkapi semua data pendaftaran!" });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [mapelResult] = await connection.query(
      "SELECT id_mapel FROM mata_pelajaran WHERE nama = ?",
      [nama_mapel],
    );

    if (mapelResult.length === 0) {
      throw new Error("Mata pelajaran tidak ditemukan.");
    }
    const id_mapel = mapelResult[0].id_mapel;

    const [jadwalResult] = await connection.query(
      "SELECT jam_mulai, jam_selesai FROM jadwal WHERE id_jadwal = ?",
      [id_jadwal],
    );

    if (jadwalResult.length === 0) {
      throw new Error("Jadwal tidak ditemukan.");
    }
    const jam_mulai_les = jadwalResult[0].jam_mulai;
    const jam_selesai_les = jadwalResult[0].jam_selesai;

    const [daftarResult] = await connection.query(
      "INSERT INTO pendaftaran (id_murid) VALUES (?)",
      [id_murid],
    );
    const id_daftar = daftarResult.insertId;

    await connection.query(
      `INSERT INTO pendaftaran_item 
      (id_daftar, id_jadwal, id_mapel, tanggal_mulai, tanggal_selesai, jam_mulai_les, jam_selesai_les, status, catatan) 
      VALUES (?, ?, ?, ?, ?, ?, ?, 'Mendatang', 'Booking Baru')`,
      [
        id_daftar,
        id_jadwal,
        id_mapel,
        tanggal_mulai,
        tanggal_selesai,
        jam_mulai_les,
        jam_selesai_les,
      ],
    );

    await connection.commit();
    res.status(201).json({ message: "Berhasil menyimpan ke daftar booking!" });
  } catch (error) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  } finally {
    connection.release();
  }
});

module.exports = router;
