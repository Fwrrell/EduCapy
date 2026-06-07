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
      GROUP_CONCAT(DISTINCT mp.nama SEPARATOR ', ') AS matapelajaran,
      MIN(jk.tanggal_awal_bersedia) AS tanggal_mulai_bersedia,
      MAX(jk.tanggal_akhir_bersedia) AS tanggal_selesai_bersedia
    FROM user u
    JOIN guru g ON u.Id_user = g.Id_guru
    LEFT JOIN keahlian k ON g.Id_guru = k.Id_guru
    LEFT JOIN mata_pelajaran mp ON k.Id_mapel = mp.Id_mapel
    LEFT JOIN jadwal_kesediaan jk ON jk.id_guru = g.Id_guru
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
  try {
    // jadwal utama berisikan jadwal kesediaan guru
    const jadwalUtama = `SELECT j.id_jadwal, 
                          j.jam_mulai, 
                          j.jam_selesai, 
                          j.hari_mengajar,
                          jk.tanggal_awal_bersedia,     
                          jk.tanggal_akhir_bersedia
                          FROM jadwal j 
                          JOIN jadwal_kesediaan jk ON jk.id_kesediaan = j.id_kesediaan
                          WHERE jk.id_guru = ?`;
    const [tersedia] = await db.query(jadwalUtama, [idGuru]);
    // mengambil jadwal yang telah dibooking  oleh murid
    const jadwalBook = `SELECT pi.id_jadwal,
                        j.hari_mengajar,
                        pi.tanggal_mulai,
                        pi.tanggal_selesai,
                        pi.jam_mulai_les, 
                        pi.jam_selesai_les
                        FROM pendaftaran_item pi
                        JOIN jadwal j ON j.id_jadwal=pi.id_jadwal
                        JOIN jadwal_kesediaan jk ON j.id_kesediaan = jk.id_kesediaan
                        WHERE jk.id_guru= ?
                         AND pi.status!='Dibatalkan'
                         AND pi.tanggal_selesai>=CURDATE()`;
    const [terbooking] = await db.query(jadwalBook, [idGuru]);
    res.status(200).json({ tersedia, terbooking });
  } catch (err) {
    console.error("gagal mengambil jadwal:", err);
    return res.status(500).json({ error: "gagal mengambil data jadwal" });
  }
});

router.post("/booking", verifyToken, async (req, res) => {
  const id_murid = req.user.id_user;

  const {
    id_jadwal,
    nama_mapel,
    tanggal_mulai,
    tanggal_selesai,
    jam_mulai_les,
    jam_selesai_les,
  } = req.body;

  if (
    !id_jadwal ||
    !nama_mapel ||
    !tanggal_mulai ||
    !tanggal_selesai ||
    !jam_mulai_les ||
    !jam_selesai_les
  ) {
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
    // ambil hari kesediaan mengajar guru
    const [jadwalResult] = await connection.query(
      "SELECT hari_mengajar FROM jadwal WHERE id_jadwal = ?",
      [id_jadwal],
    );

    if (jadwalResult.length === 0) {
      throw new Error("Jadwal tidak ditemukan.");
    }
    const hari_mengajar = jadwalResult[0].hari_mengajar;

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
    console.error(error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  } finally {
    connection.release();
  }
});

router.get("/jadwalku", verifyToken, async (req, res) => {
  const idMurid = req.user.id_user;
  const query = `SELECT u.nama as nama_guru, 
                    mp.nama as nama_mapel, 
                    j.hari_mengajar, 
                    pi.tanggal_mulai,
                    pi.tanggal_selesai,
                    pi.jam_mulai_les, 
                    pi.jam_selesai_les, 
                    pi.status,
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
  const updateQuery = `UPDATE pendaftaran_item pi
                       JOIN jadwal j ON j.id_jadwal=pi.id_jadwal
                       SET pi.status='Selesai'
                       WHERE pi.status='Mendatang'
                        AND pi.id_daftar IN (SELECT id_daftar FROM pendaftaran WHERE id_murid= ?)
                        AND (
                            CURDATE()>pi.tanggal_mulai OR DAYNAME(CURDATE())=hari_mengajar AND CURTIME()>pi.jam_selesai_les)`;
  try {
    await db.query(updateQuery, [idMurid]);
    const [results] = await db.query(query, [idMurid]);
    res.status(200).json(results);
  } catch (err) {
    console.error("gagal mengambil jadwal murid", err);
    return res.status(500).json({ error: "gagal mengambil data jadwal murid" });
  }
});

router.get("/riwayat-kelas", verifyToken, async (req, res) => {
  const idMurid = req.user.id_user;
  const query = `SELECT
                    u.nama AS nama_guru,
                    mp.nama AS mata_pelajaran,
                    tp.jenjang,
                    pi.tanggal_mulai,
                    pi.tanggal_selesai,
                    pi.jam_mulai_les,
                    pi.jam_selesai_les,
                    j.hari_mengajar,
                    TIMESTAMPDIFF(HOUR, pi.jam_mulai_les, pi.jam_selesai_les) AS jam_per_pertemuan,
      
                    FLOOR(DATEDIFF(pi.tanggal_selesai, pi.tanggal_mulai) / 7) + 1 AS jumlah_pertemuan,
      
                    (FLOOR(DATEDIFF(pi.tanggal_selesai, pi.tanggal_mulai) / 7) + 1) * TIMESTAMPDIFF(HOUR, pi.jam_mulai_les, pi.jam_selesai_les) AS total_sesi
                    FROM pendaftaran_item pi
                    JOIN jadwal j ON pi.id_jadwal = j.id_jadwal
                    JOIN jadwal_kesediaan jk ON jk.id_kesediaan = j.id_kesediaan
                    JOIN guru g ON g.id_guru = jk.id_guru
                    JOIN user u ON u.id_user=g.id_guru
                    JOIN pendaftaran p ON p.id_daftar=pi.id_daftar
                    JOIN mata_pelajaran mp ON mp.id_mapel = pi.id_mapel
                    JOIN tingkat_pendidikan tp ON tp.id_pendidikan=mp.id_pendidikan
                    WHERE p.id_murid = ?`;
  try {
    const [results] = await db.query(query, [idMurid]);
    res.status(200).json(results);
  } catch (error) {
    console.error("Gagal mengambil riwayat kelas:", error);
    return res
      .status(500)
      .json({ error: "Gagal mengambil data riwayat kelas" });
  }
});
module.exports = router;
