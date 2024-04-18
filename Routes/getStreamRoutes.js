const express = require("express");
const router = express.Router();
const { connect } = require("getstream");
const dotenv = require("dotenv");
dotenv.config();

router.get("/", async (req, res) => {
  if (!req.body.user) return res.status(400).send({ msg: "User not found" });

  try {
    const client = connect(
      process.env.STREAM_API_KEY,
      process.env.STREAM_SECRET,
      process.env.STREAM_ID,
      { location: "us-east", timeout: 15000 }
    );
    const userToken = client.createUserToken("the-user-id");

    return res.status(200).send({ userToken: userToken });
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
});

module.exports = router;
