const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const app = express();

// middlewares
app.use(cors()); // memberikan akses untuk resource sharing
app.use(express.json()); // parsing JSON
app.use(express.urlencoded({ extended: true })); // parsing URL

// contoh route testing
app.get("/api/tingkat-pendidikan", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM tingkat_pendidikan");
    res.status(200).json({
      status: "success",
      data: rows,
    });
  } catch (err) {
    console.error("Error fetching data: ", err);
    res.status(505).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Educapy App listening on port ${PORT}`);
});
