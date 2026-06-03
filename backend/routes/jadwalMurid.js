const db = require("../config/db");
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/jadwalku", verifyToken, async (req, res) => {
  const idMurid = req.user.id_user;
  const query = `SELECT u.nama as nama_guru, 
                    mp.nama as nama_mapel, 
                    j.hari_mengajar, 
                    pi.jam_mulai_les, 
                    pi.jam_selesai_les, 
                    tp.jenjang,
                    tp.tingkat
                FROM pendaftaran_item pi
                JOIN jadwal j ON j.id_jadwal=pi.id_jadwal 
                JOIN mata_pelajaran mp ON mp.id_mapel=pi.id_mapel
                JOIN tingkat_pendidikan tp ON tp.id_pendidikan = mp.id_pendidikan
                JOIN pendaftaran p ON p.id_daftar=pi.id_daftar
                JOIN jadwal_kesediaan jd ON jd.id_kesediaan=j.id_kesediaan
                JOIN guru g ON g.id_guru = jd.id_guru
                JOIN user u ON u.id_user = g.id_guru
                WHERE p.id_murid= ?`;
  try {
    const [results] = await db.query(query, [idMurid]);
    res.status(200).json(results);
  } catch (err) {
    console.error("gagal mengambil jadwal murid", err);
    return res.status(500).json({ error: "gagal mengambil data jadwal murid" });
  }
});
module.exports = router;
