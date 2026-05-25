const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const adminRoutes = require("./admin");
const guruRoutes = require("./guru");
const muridRoutes = require("./murid");

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/guru", guruRoutes);
router.use("/murid", muridRoutes);

module.exports = router;
