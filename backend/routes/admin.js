const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

// semua endpoint di admin wajib menggunakan token dan role = admin
router.use(verifyToken);
router.use(isAdmin);

// ----- CREATE GURU (ADMIN) -----
router.post("/guru", async (req, res) => {
  const { nama, email, password, alamat, pendidikan, keahlian } = req.body;

  if (!nama || !email || !password || !alamat || !pendidikan) {
    return res.status(400).json({ message: "Lengkapi data yang diperlukan!" });
  }

  // bikin connection khusus untuk transaction
  const connection = await db.getConnection();

  try {
    // cek datanya udah ada apa belum
    const [existingUser] = await connection.query(
      "SELECT id_user FROM user WHERE email = ?",
      [email],
    );
    if (existingUser.length > 0) {
      await connection.rollback();
      connection.release();
      return res
        .status(409)
        .json({ message: "Email sudah terdaftar di sistem!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.beginTransaction();

    // insert ke table user (role hardcoded, guru)
    const insertUser =
      "INSERT INTO user (nama, role, email, password, alamat) VALUES (?, ?, ?, ?, ?)";
    const [userResult] = await connection.query(insertUser, [
      nama,
      "guru",
      email,
      hashedPassword,
      alamat,
    ]);
    const newUserId = userResult.insertId;

    // insert ke table guru
    const insertGuru = "INSERT INTO guru (id_guru, pendidikan) VALUES (?, ?)";
    await connection.query(insertGuru, [newUserId, pendidikan]);

    // insert ke table keahlian
    if (keahlian && Array.isArray(keahlian) && keahlian.length > 0) {
      const keahlianData = keahlian.map((id_mapel) => [newUserId, id_mapel]);
      const insertKeahlian =
        "INSERT INTO keahlian (id_guru, id_mapel) VALUES ?";
      await connection.query(insertKeahlian, [keahlianData]);
    }

    // commit jika transaction berhasil
    await connection.commit();

    // ambil data user yang baru aja register
    const [userData] = await connection.query(
      `SELECT u.id_user, u.nama, u.email, u.alamat, g.pendidikan
       FROM user u
       JOIN guru g ON u.id_user = g.id_guru
       WHERE u.id_user = ?`,
      [newUserId],
    );

    res.status(201).json({
      message: "Registrasi guru berhasil",
      data: userData[0],
    });
  } catch (err) {
    // kalo ada error cancel semua perubahan
    await connection.rollback();
    console.error("Transaction error: ", err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  } finally {
    // kembalikan connection ke pool
    connection.release();
  }
});

router.get("/murid-terdaftar", async (req, res) => {
  try {
    const query = `
        SELECT 
          u.id_user AS id,
          u.nama,
          tp.tingkat,
          tp.jenjang,
          COUNT(pi.id_pendItem) AS jumlah_kelas
        FROM user u
        JOIN murid m ON u.id_user = m.id_murid
        LEFT JOIN tingkat_pendidikan tp ON m.id_pendidikan = tp.id_pendidikan
        LEFT JOIN pendaftaran p ON m.id_murid = p.id_murid
        LEFT JOIN pendaftaran_item pi ON p.id_daftar = pi.id_daftar
        WHERE u.role = 'murid'
        GROUP BY u.id_user, u.nama, tp.tingkat, tp.jenjang
      `;
    const [results] = await db.query(query);

    res.status(200).json(results);
  } catch (error) {
    console.error("Gagal mengambil data murid:", error);
    res.status(500).json({ error: "Gagal mengambil data murid dari server" });
  }
});

router.get("/guru-terdaftar", async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id_user AS id,
        u.nama,
        u.email,
        g.pendidikan,
        GROUP_CONCAT(mp.nama SEPARATOR ', ') AS keahlian_mapel
      FROM user u
      JOIN guru g ON u.id_user = g.id_guru
      LEFT JOIN keahlian k ON g.id_guru = k.id_guru
      LEFT JOIN mata_pelajaran mp ON k.id_mapel = mp.id_mapel
      WHERE u.role = 'guru'
      GROUP BY u.id_user, u.nama, u.email, g.pendidikan
    `;

    const [results] = await db.query(query);

    res.status(200).json(results);
  } catch (error) {
    console.error("Gagal mengambil data guru:", error);
    res.status(500).json({ error: "Gagal mengambil data guru dari server" });
  }
});

router.get("/mata-pelajaran", async (req, res) => {
  try {
    const query = `SELECT id_mapel AS id, nama FROM mata_pelajaran`;

    const [rows] = await db.query(query);

    return res.status(200).json({
      status: "success",
      data: rows,
    });
  } catch (error) {
    console.error("Gagal mengambil data mata pelajara: ", error);
    res
      .status(500)
      .json({ error: "Gagal mengambil data mata pelajaran dari server" });
  }
});

router.get("/dashboard", async (req, res) => {
  try {
    const sqlSesiMendatang = `
      SELECT 
        COUNT(id_penditem) AS sesi_mendatang 
      FROM pendaftaran_item 
      WHERE status = 'Mendatang' AND tanggal_mulai >= CURDATE();
    `;

    const sqlPelajaran = `
      SELECT 
        COUNT(id_mapel) AS total_pelajaran 
      FROM mata_pelajaran;
    `;

    const sqlTopMapel = `
      SELECT 
          mp.nama AS mapel_terfavorit, 
          COUNT(pi.id_penditem) AS total_diambil
      FROM pendaftaran_item pi
      JOIN mata_pelajaran mp ON pi.id_mapel = mp.id_mapel
      GROUP BY pi.id_mapel
      ORDER BY total_diambil DESC
      LIMIT 1;
    `;

    const sqlSumJamGuru = `
      SELECT 
          COALESCE(SUM(TIMESTAMPDIFF(MINUTE, j.jam_mulai, j.jam_selesai)) / 60, 0) AS kapasitas_jam_per_minggu
      FROM jadwal j
      JOIN jadwal_kesediaan jk ON j.id_kesediaan = jk.id_kesediaan
      WHERE CURDATE() BETWEEN jk.tanggal_awal_bersedia AND jk.tanggal_akhir_bersedia;
    `;

    const sqlRecentPendaftaran = `
      SELECT 
        pi.id_penditem, 
        u_murid.nama AS nama_murid, 
        u_guru.nama AS nama_guru, 
        mp.nama AS nama_mapel,
        pi.created_at
      FROM pendaftaran_item pi
      JOIN pendaftaran p ON pi.id_daftar = p.id_daftar
      JOIN user u_murid ON p.id_murid = u_murid.id_user
      JOIN jadwal j ON pi.id_jadwal = j.id_jadwal
      JOIN jadwal_kesediaan jk ON j.id_kesediaan = jk.id_kesediaan
      JOIN user u_guru ON jk.id_guru = u_guru.id_user
      JOIN mata_pelajaran mp ON pi.id_mapel = mp.id_mapel
      ORDER BY pi.id_penditem DESC 
      LIMIT 5
    `;

    const sqlGuruDaftar = `
      SELECT 
        id_user, 
        nama, 
        email,
        created_at
      FROM user 
      WHERE role = 'guru' 
      ORDER BY id_user DESC 
      LIMIT 5
    `;

    const sqlMuridDaftar = `
      SELECT 
        id_user, 
        nama, 
        email,
        created_at
      FROM user 
      WHERE role = 'murid' 
      ORDER BY id_user DESC 
      LIMIT 5
    `;

    const [
      [sesiMendatangResult],
      [pelajaranResult],
      [topMapelResult],
      [banyakJamResult],
      [pendaftaraanTerbaru],
      [guruBaruResult],
      [muridBaruResult],
    ] = await Promise.all([
      db.query(sqlSesiMendatang),
      db.query(sqlPelajaran),
      db.query(sqlTopMapel),
      db.query(sqlSumJamGuru),
      db.query(sqlRecentPendaftaran),
      db.query(sqlGuruDaftar),
      db.query(sqlMuridDaftar),
    ]);

    const dashboardData = {
      statistik: {
        sesi_mendatang: sesiMendatangResult[0].sesi_mendatang,
        total_pelajaran: pelajaranResult[0].total_pelajaran,
        mapel_terfavorit:
          topMapelResult.length > 0 ? topMapelResult[0].mapel_terfavorit : "-",
        jam_tersedia: parseFloat(banyakJamResult[0].kapasitas_jam_per_minggu),
      },
      log_aktivitas: {
        pendaftaran: pendaftaraanTerbaru,
        guru_baru: guruBaruResult,
        murid_baru: muridBaruResult,
      },
    };

    res.status(200).json({
      status: "success",
      data: dashboardData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

module.exports = router;
