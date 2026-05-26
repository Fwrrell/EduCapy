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
  let connection;
  try {
    connection = await db.getConnection();
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
    const [results] = await connection.query(query);

    res.status(200).json(results);
  } catch (error) {
    console.error("Gagal mengambil data murid:", error);
    res.status(500).json({ error: "Gagal mengambil data murid dari server" });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
