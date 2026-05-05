const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Otp = require("../models/Otp");

// ================= SEND OTP =================
router.post("/send-otp", async (req, res) => {
  try {
    const { email, mobile } = req.body;

    console.log("OTP Request:", req.body);

    if (!email && !mobile) {
      return res
        .status(400)
        .json({
          message:
            "Email or mobile required",
        });
    }

    const otp = Math.floor(
      100000 +
        Math.random() * 900000
    ).toString();

    await Otp.create({
      email: email || null,
      mobile: mobile || null,
      otp,
    });

    console.log(
      "OTP Generated:",
      otp
    );

    res.json({
      message:
        "OTP sent successfully",
      otp, // debug only
    });
  } catch (error) {
    console.log(
      "SEND OTP ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to send OTP",
    });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, mobile, password, otp, mode } = req.body;

    let user;

    if (mode === "email-password") {
      user = await User.findOne({ email }).select("+password");
      if (!user) return res.status(400).json({ message: "User not found" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: "Invalid credentials" });
    }

    if (mode === "mobile-password") {
      user = await User.findOne({ mobile }).select("+password");
      if (!user) return res.status(400).json({ message: "User not found" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: "Invalid credentials" });
    }

    if (mode === "email-otp") {
      const otpRecord = await Otp.findOne({ email, otp });
      if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });

      user = await User.findOne({ email });
    }

    if (mode === "mobile-otp") {
      const otpRecord = await Otp.findOne({ mobile, otp });
      if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });

      user = await User.findOne({ mobile });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.password = undefined;

    res.json({ token, user });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, password, otp, role } = req.body;

    const otpRecord = await Otp.findOne({
      $or: [{ email }, { mobile }],
      otp,
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const existing = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const allowedRoles = [
      "buyer",
      "seller",
      "agent",
      "builder",
    ];

    const finalRole = allowedRoles.includes(role)
      ? role
      : "buyer";

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashed,
      role: finalRole,
    });

    res.json({
      message: "User created",
      user,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;