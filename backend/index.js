const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const app = express();
const apiRouter = require("./routes");

// middlewares
app.use(cors()); // memberikan akses untuk resource sharing
app.use(express.json()); // parsing JSON
app.use(express.urlencoded({ extended: true })); // parsing URL

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Educapy App listening on port ${PORT}`);
});
