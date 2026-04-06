const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const { name, email, message } = req.body;

  console.log("Contact Form Data:");
  console.log(name, email, message);

  res.status(200).json({ message: "Message received successfully!" });
});

module.exports = router;