const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "educapy_db",
});

db.connect((err) => {
  if (err) {
    console.error("gagal koneksi ke database", err);
    return;
  }
  console.log("berhasil koneksi ke database");
});

const PORT = 5000;
app.post("/api/register", (req, res) => {
  // 1. Tangkap SEMUA variabel dari React, termasuk jenjang & tingkat
  const { nama, email, password, alamat, jenjang, tingkat } = req.body;

  const queryPendidikan =
    "SELECT Id_pendidikan FROM Pendidikan WHERE jenjang = ? AND tingkat = ?";

  db.query(queryPendidikan, [jenjang, tingkat], (err, resultsPendidikan) => {
    if (err) {
      console.error("Error mencari tingkat pendidikan:", err);
      return res.status(500).json({ error: "Gagal memproses data pendidikan" });
    }

    if (resultsPendidikan.length === 0) {
      return res
        .status(400)
        .json({ error: "Jenjang atau tingkat pendidikan tidak valid!" });
    }

    const idPendidikan = resultsPendidikan[0].Id_pendidikan;
    const queryUser =
      "INSERT INTO `user` (nama, role, email, password, alamat) VALUES (?, 'murid', ?, ?, ?)";

    db.query(queryUser, [nama, email, password, alamat], (err, resultUser) => {
      if (err) {
        console.error("Gagal menyimpan data:", err);
        return res.status(500).json({ error: "Gagal mendaftarkan akun" });
      }

      const idUserBaru = resultUser.insertId;

      const queryMurid =
        "INSERT INTO murid (Id_murid, Id_pendidikan) VALUES (?, ?)";

      db.query(queryMurid, [idUserBaru, idPendidikan], (err, resultMurid) => {
        if (err) {
          console.error("Gagal menyimpan relasi murid:", err);
          return res
            .status(500)
            .json({ error: "Gagal menyelesaikan pendaftaran murid" });
        }

        console.log("User & Murid baru diregistrasi dengan ID:", idUserBaru);
        console.log(idPendidikan);
        res
          .status(200)
          .json({ message: "Pendaftaran Berhasil!", userId: idUserBaru });
      });
    });
  });
});
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM `user` WHERE email = ? AND password = ?";

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Terjadi kesalahan:", err);
      return res.status(500).json({ error: "Terjadi kesalahan pada server" });
    }

    if (results.length > 0) {
      console.log("User berhasil login:", email);
      res.status(200).json({ message: "Login Sukses!", user: results[0] });
    } else {
      console.log("Percobaan login gagal :", email);
      res.status(401).json({ error: "Email atau Password salah!" });
    }
  });
});
app.listen(PORT, () => {
  console.log(`server backend menyala di http://localhost:${PORT}`);
});
