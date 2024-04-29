const express = require("express");
const router = express.Router();
/**
 * @description Routes for admin
 * @author Borgar Flaen Stensrud & Hussein Abdul-Ameer
 * !! ikke i bruk!
 */
router.get("/", async (req, res) => {
  return res.status(200).send({ msg: "Admin route" });
});

module.exports = router;
