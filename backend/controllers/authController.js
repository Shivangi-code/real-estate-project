const User = require("../models/User");
const Otp = require("../models/Otp");
const Token = require("../models/Token");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    let { name, email, mobile, password, role } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    email = email.toLowerCase();

    const exists = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      mobile,
      password: hashed,
      role: ["buyer", "seller", "agent", "builder"].includes(role)
        ? role
        : "buyer",
      isVerified: true,
    });

    user.password = undefined;

    res.status(201).json({ message: "Signup successful", user });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { mode, email, mobile, password, otp } = req.body;

    let user;

    // EMAIL + PASSWORD
    if (mode === "email-password") {
      user = await User.findOne({ email }).select("+password");

      if (!user) return res.status(404).json({ message: "User not found" });

  // 👇 TEMP FIX
      if (user.password === password) {
        console.log("Plain password matched (old user)");
      } else {
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });
      }
    }

    // MOBILE + PASSWORD
    else if (mode === "mobile-password") {
      user = await User.findOne({ mobile }).select("+password");

      if (!user) return res.status(404).json({ message: "User not found" });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ message: "Invalid credentials" });
    }

    // EMAIL OTP
    else if (mode === "email-otp") {
      const record = await Otp.findOne({ email });

      if (!record) return res.status(400).json({ message: "OTP not found" });

      if (record.otp.toString() !== otp.toString()) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      user = await User.findOne({ email });
    }

    // MOBILE OTP
    else if (mode === "mobile-otp") {
      const record = await Otp.findOne({ mobile });

      if (!record) return res.status(400).json({ message: "OTP not found" });

      if (record.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      user = await User.findOne({ mobile });
    }

    else {
      return res.status(400).json({ message: "Invalid mode" });
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });

  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ================= SEND OTP =================
exports.sendOtp = async (req, res) => {
  try {
    const { email, mobile } = req.body;

    if (!email && !mobile) {
      return res.status(400).json({ message: "Email or mobile required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.findOneAndUpdate(
      email ? { email } : { mobile },
      { otp },
      { upsert: true, new: true }
    );

    console.log("OTP:", otp);

    res.json({ message: "OTP sent" });

  } catch (err) {
    console.error("OTP ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};