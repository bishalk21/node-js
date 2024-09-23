const express = require("express");
const { authAdmin } = require("../../middlewares/auth");
const router = express.Router();

router.post("/send/interested/:userId", authAdmin, async (req, res, next) => {
  try {
    const user = req.user;

    res.send(`${user.firstName} is interested in connecting with you`);
  } catch (error) {
    res.status(500).send("Error sending request:" + error.message);
  }
});

module.exports = router;
