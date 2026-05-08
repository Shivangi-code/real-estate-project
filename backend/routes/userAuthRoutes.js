const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    let user;

    if (email) {
      user = await User.findOne({ email }).select("+password");
    } else if (mobile) {
      user = await User.findOne({ mobile }).select("+password");
    } else {
      return res.status(400).json({
        message: "Email or mobile required",
      });
    }

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
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
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, password, role } = req.body;

    if (!name || !password) {
      return res.status(400).json({
        message: "Name and password required",
      });
    }

    if (!email && !mobile) {
      return res.status(400).json({
        message: "Email or mobile required",
      });
    }

    const existing = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existing) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const allowedRoles = [
      "buyer",
      "seller",
      "builder", // ✅ agent removed
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
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;