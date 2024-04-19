const express = require("express");
const mediaRoutes = require("./Routes/mediaRoutes");
const { checkJwt } = require("./Controllers/Auth/middleware");
const adminRoutes = require("./Routes/adminRoutes");
const getStreamRoutes = require("./Routes/getStreamRoutes");
const chessRoutes = require("./Routes/chessRoutes");
const router = express.Router();

router.use("/media", mediaRoutes);
router.use("/admin", checkJwt, adminRoutes);
router.use("/chess", chessRoutes);

module.exports = router;
