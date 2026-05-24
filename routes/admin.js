const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/db");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

// ----- CREATE GURU (ADMIN) -----
router.post("/guru", async (req, res) => {
  const { nama, email, password, alamat, pendidikan } = req.body;

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

module.exports = router;
