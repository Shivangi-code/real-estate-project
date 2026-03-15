const User = require("../models/User");
const Otp = require("../models/Otp");
const generateOtp = require("../utils/generateOtp");
const jwt = require("jsonwebtoken");

// SEND OTP
exports.sendOtp = async (req, res) => {
  try {
    const { name, mobile } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({ message: "Name and Mobile required" });
    }

    const otp = generateOtp();

    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await Otp.findOneAndUpdate(
      { mobile },
      { otp, expiresAt: expires },
      { upsert: true, new: true }
    );

    console.log("OTP for", mobile, ":", otp);

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const record = await Otp.findOne({ mobile });

    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // ADMIN MOBILE NUMBER
    const ADMIN_MOBILE = "6261764560";  // change this

    let user = await User.findOne({ mobile });

    if (!user) {
      const role = mobile === ADMIN_MOBILE ? "admin" : "buyer";

      user = await User.create({
        name: "User",
        mobile,
        role,
        isVerified: true
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    await Otp.deleteOne({ mobile });

    res.json({
      message: "Login successful",
      token,
      role: user.role
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};