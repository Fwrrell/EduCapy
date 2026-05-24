const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const router = express.Router();

// secret key untuk JWT
const JWT_SECRET = process.env.JWT_SECRET;

// ----- REGISTER USER (KHUSUS MURID) -----
router.post("/register", async (req, res) => {
  const { nama, email, password, alamat, id_pendidikan } = req.body;

  if (!nama || !email || !password || !id_pendidikan) {
    return res.status(400).json({ message: "Lengkapi data yang diperlukan!" });
  }

  // bikin connection khusus untuk transaction
  const connection = await db.getConnection();

  try {
    const [existingUser] = await connection.query(
      "SELECT * FROM user where email = ?",
      [email],
    );

    if (existingUser.length > 0) {
      await connection.rollback();
      connection.release();
      return res.status(409).json({ message: "Email sudah digunakan!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.beginTransaction();

    // insert ke table user (role hardcoded, murid)
    const insertUser =
      "INSERT INTO user (nama, role, email, password, alamat) VALUES (?, ?, ?, ?, ?)";
    const [userResult] = await connection.query(insertUser, [
      nama,
      "murid",
      email,
      hashedPassword,
      alamat,
    ]);
    const newUserId = userResult.insertId;

    // insert ke table murid
    const insertMurid =
      "INSERT INTO murid (id_murid, id_pendidikan) VALUES (?, ?)";
    const [muridResult] = await connection.query(insertMurid, [
      newUserId,
      id_pendidikan,
    ]);

    // commit jika transaction berhasil
    await connection.commit();

    // ambil data user yang baru aja register
    const [userData] = await connection.query(
      `SELECT u.id_user, u.nama, u.email, u.alamat, p.jenjang, p.tingkat
   FROM user u
   JOIN murid m ON u.id_user = m.id_murid
   JOIN tingkat_pendidikan p ON m.id_pendidikan = p.id_pendidikan
   WHERE u.id_user = ?`,
      [newUserId],
    );

    res.status(201).json({
      message: "Registrasi murid berhasil",
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

// ----- LOGIN USER -----
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan Password harus diisi!" });
  }

  try {
    const [users] = await db.query("SELECT * FROM user WHERE email = ?", [
      email,
    ]);
    if (users.length === 0) {
      return res.status(401).json({ message: "Email atau password salah!" });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email atau password salah!" });
    }

    const token = jwt.sign(
      { id_user: user.id_user, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(200).json({
      message: "Login berhasil",
      token: token,
      data: {
        id_user: user.id_user,
        nama: user.nama,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
});

module.exports = router;
