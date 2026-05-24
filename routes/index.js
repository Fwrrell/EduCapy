const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const adminRoutes = require("./admin");
const guruRoutes = require("./guru");

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/guru", guruRoutes);

module.exports = router;
