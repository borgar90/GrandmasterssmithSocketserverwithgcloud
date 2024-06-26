const express = require("express");
const mediaRoutes = require("./Routes/mediaRoutes");

const adminRoutes = require("./Routes/adminRoutes");
const getStreamRoutes = require("./Routes/getStreamRoutes");
const chessRoutes = require("./Routes/chessRoutes");
const router = express.Router();

router.use("/media", mediaRoutes);
router.use("/admin", adminRoutes);
router.use("/chess", chessRoutes);
router.use("/getStream", getStreamRoutes);

module.exports = router;
