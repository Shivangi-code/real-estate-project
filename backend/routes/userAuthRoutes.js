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

    if (!email && !mobile) {
      return res.status(400).json({ message: "Email or mobile required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({
      email: email || null,
      mobile: mobile || null,
      otp,
    });

    console.log("🔥 OTP:", otp);

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, mobile, password, otp, mode } = req.body;

    let user;

    // ================= EMAIL + PASSWORD =================
    if (mode === "email-password") {
      user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    }

    // ================= MOBILE + PASSWORD =================
    if (mode === "mobile-password") {
      user = await User.findOne({ mobile }).select("+password");

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    }

    // ================= EMAIL OTP =================
    if (mode === "email-otp") {
      const otpRecord = await Otp.findOne({ email, otp });

      if (!otpRecord) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
    }

    // ================= MOBILE OTP =================
    if (mode === "mobile-otp") {
      const otpRecord = await Otp.findOne({ mobile, otp });

      if (!otpRecord) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      user = await User.findOne({ mobile });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
    }

    // ================= JWT =================
    const payload = {
      id: user._id,
      role: user.role || "buyer",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined;

    res.json({
      token,
      user,
    });

  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, password, otp } = req.body;

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

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashed,
      role: "buyer",
    });

    res.json({ message: "User created", user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// ================= RESET PASSWORD =================
router.post("/reset-password", async (req, res) => {
  try {
    const { email, mobile, otp, newPassword } = req.body;

    if (!otp || !newPassword) {
      return res.status(400).json({ message: "OTP & new password required" });
    }

    const otpRecord = await Otp.findOne({
      $or: [{ email }, { mobile }],
      otp,
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.findOne({
      $or: [{ email }, { mobile }],
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const bcrypt = require("bcryptjs");
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password reset successful ✅" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;