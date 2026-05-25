const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// middleware untuk verifikasi jwt nya untuk melakukan sesuatu yang membutuhkan role admin
const verifyToken = (req, res, next) => {
  // client harus kirim token di header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Akses ditolak: Token tidak ditemukan atau format salah.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // lakukan decoded untuk mendapatkan data payload (id_user dan role)
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // simpan data user ke object request agar bisa dibaca oleh rute selanjutnya
    next();
  } catch (err) {
    return res.status(403).json({
      status: "error",
      message: "Token tidak valid atau sudah kadaluwarsa",
    });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({
      status: "error",
      message: "Akses ditolak! Fitur ini hanya untuk Admin.",
    });
  }
};

module.exports = { verifyToken, isAdmin };
