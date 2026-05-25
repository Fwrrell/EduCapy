const express = require("express");
const router = express.Router();
const db = require("../config/db");

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

module.exports = router;
