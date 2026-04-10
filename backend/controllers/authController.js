const User = require("../models/User");
const Otp = require("../models/Otp");
const Token = require("../models/Token");

const jwt = require("jsonwebtoken");

const {
  hashPassword,
  comparePassword,
} = require("../utils/authUtils");

const {
  hashOtp,
  compareOtp,
} = require("../utils/otpUtils");


// =============================
// ✅ SIGNUP (UNCHANGED)
// =============================
exports.signup = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    email = email.toLowerCase();

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await hashPassword(password);

    const allowedRoles = ["buyer", "seller"];
    const finalRole = allowedRoles.includes(role) ? role : "buyer";

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: finalRole,
      isVerified: true,
    });

    user.password = undefined;

    res.status(201).json({
      message: "Signup successful",
      user,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =============================
// ✅ LOGIN (FIXED 🔥)
// =============================
exports.login = async (req, res) => {
  try {
    let { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    email = email.toLowerCase();

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (role && user.role !== role) {
      return res.status(403).json({ message: "Unauthorized role access" });
    }

    const payload = {
      id: user._id,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "7d",
    });

    await Token.create({
      userId: user._id,
      token: refreshToken,
    });

    user.password = undefined;

    res.json({
      accessToken,        // ✅ FIXED
      refreshToken,
      user,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =============================
// ✅ SEND OTP (UNCHANGED)
// =============================
exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number required" });
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

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =============================
// ✅ VERIFY OTP (FIXED 🔥)
// =============================
exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp, name } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: "Mobile & OTP required" });
    }

    const record = await Otp.findOne({ mobile });

    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (record.attempts >= 5) {
      return res.status(429).json({
        message: "Too many attempts. Try again later",
      });
    }

    const valid = await compareOtp(otp, record.otp);

    if (!valid || record.expiresAt < Date.now()) {
      record.attempts += 1;
      await record.save();

      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    let user = await User.findOne({ mobile });

    if (!user) {
      user = await User.create({
        name: name || "User",
        mobile,
        role: "buyer",
        isVerified: true,
      });
    }

    const payload = {
      id: user._id,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, {
      expiresIn: "7d",
    });

    await Token.create({
      userId: user._id,
      token: refreshToken,
    });

    user.password = undefined;

    await Otp.deleteOne({ mobile });

    res.json({
      accessToken,       // ✅ FIXED
      refreshToken,
      user,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =============================
// ✅ REFRESH TOKEN API (NEW 🔥)
// =============================
exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const stored = await Token.findOne({ token });

    if (!stored) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });

  } catch (err) {
    res.status(500).json({ message: "Token refresh failed" });
  }
};