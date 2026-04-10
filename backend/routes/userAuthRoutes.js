const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Otp = require("../models/Otp");
const Token = require("../models/Token");

const jwt = require("jsonwebtoken");

const { hashOtp, compareOtp } = require("../utils/otpUtils");


// ================= SEND OTP =================
router.post("/send-otp", async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || mobile.length !== 10) {
      return res.status(400).json({ msg: "Valid mobile required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedOtp = await hashOtp(otp);

    await Otp.findOneAndUpdate(
      { mobile },
      {
        otp: hashedOtp,
        attempts: 0,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
      { upsert: true, new: true }
    );

    console.log("OTP:", otp);

    res.json({ msg: "OTP sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


// ================= VERIFY OTP (FIXED 🔥) =================
router.post("/verify-otp", async (req, res) => {
  try {
    const { name, mobile, email, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ msg: "Mobile & OTP required" });
    }

    const record = await Otp.findOne({ mobile });

    if (!record) {
      return res.status(400).json({ msg: "OTP not found" });
    }

    if (record.attempts >= 5) {
      return res.status(429).json({
        msg: "Too many attempts. Try later",
      });
    }

    const valid = await compareOtp(otp, record.otp);

    if (!valid || record.expiresAt < Date.now()) {
      record.attempts += 1;
      await record.save();

      return res.status(400).json({
        msg: "Invalid or expired OTP",
      });
    }

    // Find or create user
    let user = await User.findOne({ mobile });

    if (!user) {
      user = await User.create({
        name: name || "User",
        email: email?.toLowerCase(),
        mobile,
        role: "buyer",
        isVerified: true,
      });
    }

    const payload = {
      id: user._id,
      role: user.role,
    };

    // ✅ ACCESS TOKEN
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    // ✅ REFRESH TOKEN
    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "7d",
    });

    // ✅ Save refresh token
    await Token.create({
      userId: user._id,
      token: refreshToken,
    });

    user.password = undefined;

    // Delete OTP
    await Otp.deleteOne({ mobile });

    res.json({
      msg: "Login success",
      accessToken,
      refreshToken,
      user,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


// ================= REFRESH TOKEN =================
router.post("/refresh-token", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const stored = await Token.findOne({ token });

    if (!stored) {
      return res.status(403).json({ msg: "Invalid refresh token" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });

  } catch (err) {
    res.status(500).json({ msg: "Token refresh failed" });
  }
});


module.exports = router;