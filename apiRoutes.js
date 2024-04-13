const express = require("express");
const mediaRoutes = require("./Routes/mediaRoutes");
const router = express.Router();

router.use("/media", mediaRoutes);

module.exports = router;
