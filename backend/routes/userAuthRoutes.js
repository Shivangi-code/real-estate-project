const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Otp = require("../models/Otp");

const generateOtp = require("../utils/generateOtp");

// ======================================================
// ================= JWT TOKEN ==========================
// ======================================================

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    }
  );
};

// ======================================================
// ================= SEND OTP ===========================
// ======================================================

router.post("/send-otp", async (req, res) => {
  try {

    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        message: "Mobile number required",
      });
    }

    // ================= FIND USER =================

    const existingUser =
      await User.findOne({
        mobile,
      });

    if (!existingUser) {
      return res.status(404).json({
        message:
          "User not found. Please signup first.",
      });
    }

    // ================= EXISTING OTP =================

    const existingOtp =
      await Otp.findOne({
        mobile,
        purpose: "login",
      });

    // ================= BLOCKED =================

    if (
      existingOtp?.blocked &&
      existingOtp?.blockedUntil >
        new Date()
    ) {
      return res.status(429).json({
        message:
          "Too many attempts. Try again later.",
      });
    }

    // ================= COOLDOWN =================

    if (
      existingOtp?.resendAvailableAt >
      new Date()
    ) {
      const seconds = Math.ceil(
        (
          existingOtp.resendAvailableAt -
          new Date()
        ) / 1000
      );

      return res.status(429).json({
        message:
          `Please wait ${seconds}s before requesting another OTP`,
      });
    }

    // ================= RESEND LIMIT =================

    if (
      existingOtp?.resendCount >= 3
    ) {

      existingOtp.blocked = true;

      existingOtp.blockedUntil =
        new Date(
          Date.now() +
            15 * 60 * 1000
        );

      await existingOtp.save();

      return res.status(429).json({
        message:
          "Too many OTP requests. Try again after 15 minutes.",
      });
    }

    // ================= GENERATE OTP =================

    const otp = generateOtp();

    // ================= DELETE OLD =================

    await Otp.deleteMany({
      mobile,
      purpose: "login",
    });

    // ================= SAVE OTP =================

    await Otp.create({
      mobile,

      otp,

      type: "sms",

      purpose: "login",

      resendCount:
        existingOtp
          ? existingOtp.resendCount + 1
          : 1,

      resendAvailableAt:
        new Date(
          Date.now() +
            30 * 1000
        ),

      ipAddress:
        req.ip,

      userAgent:
        req.headers[
          "user-agent"
        ],
    });

    console.log(
      `\n📲 LOGIN OTP for ${mobile}: ${otp}\n`
    );

    res.json({
      success: true,

      message:
        "OTP sent successfully",
    });

  } catch (error) {

    console.log(
      "SEND OTP ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ======================================================
// ================= LOGIN ==============================
// ======================================================

router.post("/login", async (req, res) => {
  try {

    const {
      mode,
      email,
      mobile,
      password,
      otp,
    } = req.body;

    // ======================================================
    // ================= EMAIL PASSWORD =====================
    // ======================================================

    if (
      mode ===
      "email-password"
    ) {

      if (
        !email ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Email & password required",
        });
      }

      const user =
        await User.findOne({
          email,
        }).select(
          "+password"
        );

      if (!user) {
        return res.status(400).json({
          message:
            "User not found",
        });
      }

      if (!user.password) {
        return res.status(400).json({
          message:
            "Password not set for this account",
        });
      }

      const match =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!match) {
        return res.status(400).json({
          message:
            "Invalid credentials",
        });
      }

      const token =
        generateToken(user);

      user.password =
        undefined;

      return res.json({
        success: true,
        token,
        user,
      });
    }

    // ======================================================
    // ================= MOBILE PASSWORD ====================
    // ======================================================

    if (
      mode ===
      "mobile-password"
    ) {

      if (
        !mobile ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Mobile & password required",
        });
      }

      const user =
        await User.findOne({
          mobile,
        }).select(
          "+password"
        );

      if (!user) {
        return res.status(400).json({
          message:
            "User not found",
        });
      }

      if (!user.password) {
        return res.status(400).json({
          message:
            "Password not set for this account",
        });
      }

      const match =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!match) {
        return res.status(400).json({
          message:
            "Invalid credentials",
        });
      }

      const token =
        generateToken(user);

      user.password =
        undefined;

      return res.json({
        success: true,
        token,
        user,
      });
    }

    // ======================================================
    // ================= MOBILE OTP =========================
    // ======================================================

    if (
      mode ===
      "mobile-otp"
    ) {

      if (
        !mobile ||
        !otp
      ) {
        return res.status(400).json({
          message:
            "Mobile & OTP required",
        });
      }

      const existingOtp =
        await Otp.findOne({
          mobile,
          otp,
          purpose: "login",
        });

      if (
        !existingOtp
      ) {
        return res.status(400).json({
          message:
            "Invalid OTP",
        });
      }

      // ================= ATTEMPTS =================

      if (
        existingOtp.attempts >=
        existingOtp.maxAttempts
      ) {

        existingOtp.blocked =
          true;

        existingOtp.blockedUntil =
          new Date(
            Date.now() +
              15 * 60 * 1000
          );

        await existingOtp.save();

        return res.status(429).json({
          message:
            "Too many invalid attempts. Try again later.",
        });
      }

      // ================= EXPIRED =================

      if (
        existingOtp.expiresAt <
        new Date()
      ) {
        return res.status(400).json({
          message:
            "OTP expired",
        });
      }

      const user =
        await User.findOne({
          mobile,
        });

      if (!user) {
        return res.status(400).json({
          message:
            "User not found. Please signup first.",
        });
      }

      user.isMobileVerified =
        true;

      await user.save();

      existingOtp.verified =
        true;

      await existingOtp.save();

      const token =
        generateToken(user);

      await Otp.deleteMany({
        mobile,
        purpose: "login",
      });

      return res.json({
        success: true,
        token,
        user,
      });
    }

    return res.status(400).json({
      message:
        "Invalid login mode",
    });

  } catch (error) {

    console.log(
      "LOGIN ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Server error",
    });
  }
});

// ======================================================
// ================= REGISTER SEND OTP ==================
// ======================================================

router.post(
  "/register-send-otp",

  async (req, res) => {

    try {

      const { mobile } =
        req.body;

      if (!mobile) {
        return res.status(400).json({
          message:
            "Mobile required",
        });
      }

      const existingUser =
        await User.findOne({
          mobile,
        });

      if (existingUser) {
        return res.status(400).json({
          message:
            "User already exists",
        });
      }

      const existingOtp =
        await Otp.findOne({
          mobile,
          purpose: "signup",
        });

      // ================= COOLDOWN =================

      if (
        existingOtp?.resendAvailableAt >
        new Date()
      ) {

        const seconds =
          Math.ceil(
            (
              existingOtp.resendAvailableAt -
              new Date()
            ) / 1000
          );

        return res.status(429).json({
          message:
            `Please wait ${seconds}s before requesting another OTP`,
        });
      }

      const otp =
        generateOtp();

      await Otp.deleteMany({
        mobile,
        purpose: "signup",
      });

      await Otp.create({
        mobile,

        otp,

        type: "sms",

        purpose: "signup",

        resendAvailableAt:
          new Date(
            Date.now() +
              30 * 1000
          ),

        ipAddress:
          req.ip,

        userAgent:
          req.headers[
            "user-agent"
          ],
      });

      console.log(
        `\n📲 SIGNUP OTP for ${mobile}: ${otp}\n`
      );

      res.json({
        success: true,
        message:
          "OTP sent successfully",
      });

    } catch (error) {

      console.log(
        "REGISTER OTP ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Server error",
      });
    }
  }
);

// ======================================================
// ================= REGISTER ===========================
// ======================================================

router.post("/register", async (req, res) => {
  try {

    const {
      name,
      email,
      mobile,
      password,
      otp,
      role,
    } = req.body;

    if (
      !name ||
      !mobile ||
      !password ||
      !otp
    ) {
      return res.status(400).json({
        message:
          "Required fields missing",
      });
    }

    const existingOtp =
      await Otp.findOne({
        mobile,
        otp,
        purpose: "signup",
      });

    if (!existingOtp) {

      return res.status(400).json({
        message:
          "Invalid OTP",
      });
    }

    if (
      existingOtp.expiresAt <
      new Date()
    ) {

      return res.status(400).json({
        message:
          "OTP expired",
      });
    }

    const existingUser =
      await User.findOne({
        $or: [
          { email },
          { mobile },
        ],
      });

    if (existingUser) {

      return res.status(400).json({
        message:
          "User already exists",
      });
    }

    const allowedRoles = [
      "buyer",
      "seller",
      "builder",
    ];

    const finalRole =
      allowedRoles.includes(
        role
      )
        ? role
        : "buyer";

    const user =
      await User.create({
        name,

        email,

        mobile,

        password,

        role:
          finalRole,

        authProvider:
          "email",

        isMobileVerified:
          true,
      });

    const token =
      generateToken(user);

    await Otp.deleteMany({
      mobile,
      purpose: "signup",
    });

    res.json({
      success: true,
      message:
        "Account created successfully",
      token,
      user,
    });

  } catch (error) {

    console.log(
      "REGISTER ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Server error",
    });
  }
});

// ======================================================
// ================= FORGOT PASSWORD OTP ================
// ======================================================

router.post(
  "/forgot-password/send-otp",

  async (req, res) => {

    try {

      const {
        email,
        mobile,
      } = req.body;

      if (
        !email &&
        !mobile
      ) {
        return res.status(400).json({
          message:
            "Email or mobile required",
        });
      }

      const user =
        await User.findOne({
          $or: [
            { email },
            { mobile },
          ],
        });

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      const existingOtp =
        await Otp.findOne({
          $or: [
            { email },
            { mobile },
          ],

          purpose:
            "forgot-password",
        });

      // ================= COOLDOWN =================

      if (
        existingOtp?.resendAvailableAt >
        new Date()
      ) {

        const seconds =
          Math.ceil(
            (
              existingOtp.resendAvailableAt -
              new Date()
            ) / 1000
          );

        return res.status(429).json({
          message:
            `Please wait ${seconds}s before requesting another OTP`,
        });
      }

      const otp =
        generateOtp();

      await Otp.deleteMany({
        email,
        mobile,
        purpose:
          "forgot-password",
      });

      await Otp.create({
        email,

        mobile,

        otp,

        type: "sms",

        purpose:
          "forgot-password",

        resendAvailableAt:
          new Date(
            Date.now() +
              30 * 1000
          ),

        ipAddress:
          req.ip,

        userAgent:
          req.headers[
            "user-agent"
          ],
      });

      console.log(
        `\n🔐 RESET OTP: ${otp}\n`
      );

      res.json({
        success: true,
        message:
          "Reset OTP sent",
      });

    } catch (error) {

      console.log(
        "FORGOT PASSWORD OTP ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Server error",
      });
    }
  }
);

// ======================================================
// ================= RESET PASSWORD =====================
// ======================================================

router.post(
  "/reset-password",

  async (req, res) => {

    try {

      const {
        email,
        mobile,
        otp,
        newPassword,
      } = req.body;

      if (
        !otp ||
        !newPassword
      ) {
        return res.status(400).json({
          message:
            "OTP & new password required",
        });
      }

      const existingOtp =
        await Otp.findOne({
          otp,

          $or: [
            { email },
            { mobile },
          ],

          purpose:
            "forgot-password",
        });

      if (
        !existingOtp
      ) {
        return res.status(400).json({
          message:
            "Invalid OTP",
        });
      }

      if (
        existingOtp.expiresAt <
        new Date()
      ) {
        return res.status(400).json({
          message:
            "OTP expired",
        });
      }

      const user =
        await User.findOne({
          $or: [
            { email },
            { mobile },
          ],
        }).select(
          "+password"
        );

      if (!user) {
        return res.status(404).json({
          message:
            "User not found",
        });
      }

      user.password =
        newPassword;

      await user.save();

      await Otp.deleteMany({
        email,
        mobile,

        purpose:
          "forgot-password",
      });

      res.json({
        success: true,
        message:
          "Password updated successfully",
      });

    } catch (error) {

      console.log(
        "RESET PASSWORD ERROR:",
        error
      );

      res.status(500).json({
        message:
          "Server error",
      });
    }
  }
);

module.exports = router;