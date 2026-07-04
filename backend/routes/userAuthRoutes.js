const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ======================================================
// ================= MODELS =============================
// ======================================================

const User = require("../models/User");
const Otp = require("../models/Otp");

// ======================================================
// ================= MIDDLEWARE =========================
// ======================================================

const { protect } = require("../middleware/authMiddleware");

// ======================================================
// ================= UTILS ==============================
// ======================================================

const generateOtp = require("../utils/generateOtp");
const sendSMS = require("../utils/sendSMS");

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
// ================= SAFE USER RESPONSE =================
// ======================================================

const sanitizeUser = (user) => {
  if (!user) return null;
  const safeUser = user.toObject ? user.toObject() : user;
  delete safeUser.password;
  return safeUser;
};

// ======================================================
// ================= SEND OTP ===========================
// ======================================================

router.post("/send-otp", async (req, res) => {
  try {
    console.log("✅ SEND OTP ROUTE HIT");
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number required",
      });
    }

    const existingUser = await User.findOne({ mobile });

    console.log("Mobile:", mobile);
console.log("Existing User:", existingUser);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please signup first.",
      });
    }

    const existingOtp = await Otp.findOne({ mobile, purpose: "login" });

    // ================= BLOCKED =================

    if (existingOtp?.blocked && existingOtp?.blockedUntil > new Date()) {
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Try again later.",
      });
    }

    // ================= COOLDOWN =================

    if (existingOtp?.resendAvailableAt > new Date()) {
      const seconds = Math.ceil(
        (existingOtp.resendAvailableAt - new Date()) / 1000
      );
      return res.status(429).json({
        success: false,
        message: `Please wait ${seconds}s before requesting another OTP`,
      });
    }

    // ================= RESEND LIMIT =================

    if (existingOtp?.resendCount >= 3) {
      existingOtp.blocked = true;
      existingOtp.blockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      await existingOtp.save();
      return res.status(429).json({
        success: false,
        message: "Too many OTP requests. Try again after 15 minutes.",
      });
    }

    // ================= GENERATE & SAVE OTP =================

    const otp = generateOtp();

    await Otp.deleteMany({ mobile, purpose: "login" });

    await Otp.create({
      mobile,
      otp,
      type: "sms",
      purpose: "login",
      resendCount: existingOtp ? existingOtp.resendCount + 1 : 1,
      resendAvailableAt: new Date(Date.now() + 30 * 1000),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    await sendSMS(
      mobile,
      `Your Housify Realty OTP is ${otp}. Do not share this OTP with anyone.`
    );

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log("SEND OTP ERROR:", error.response?.data || error.message || error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ======================================================
// ================= LOGIN ==============================
// ======================================================

router.post("/login", async (req, res) => {
  try {
    const { mode, email, mobile, password, otp } = req.body;

    // ======================================================
    // ================= EMAIL PASSWORD =====================
    // ======================================================

    if (mode === "email-password") {
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email & password required",
        });
      }

      const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      }

      if (!user.password) {
        return res.status(400).json({
          success: false,
          message: "Password not set for this account",
        });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }

      user.lastLoginAt = new Date();
      user.lastActiveAt = new Date();
      await user.save();

      const token = generateToken(user);

      return res.json({ success: true, token, user: sanitizeUser(user) });
    }

    // ======================================================
    // ================= MOBILE PASSWORD ====================
    // ======================================================

    if (mode === "mobile-password") {
      if (!mobile || !password) {
        return res.status(400).json({
          success: false,
          message: "Mobile & password required",
        });
      }

      const user = await User.findOne({ mobile }).select("+password");

      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      }

      if (!user.password) {
        return res.status(400).json({
          success: false,
          message: "Password not set for this account",
        });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(400).json({ success: false, message: "Invalid credentials" });
      }

      user.lastLoginAt = new Date();
      user.lastActiveAt = new Date();
      await user.save();

      const token = generateToken(user);

      return res.json({ success: true, token, user: sanitizeUser(user) });
    }

    // ======================================================
    // ================= MOBILE OTP =========================
    // ======================================================

    if (mode === "mobile-otp") {
      if (!mobile || !otp) {
        return res.status(400).json({
          success: false,
          message: "Mobile & OTP required",
        });
      }

      const existingOtp = await Otp.findOne({ mobile, otp, purpose: "login" });

      if (!existingOtp) {
        return res.status(400).json({ success: false, message: "Invalid OTP" });
      }

      // ================= ATTEMPTS =================

      if (existingOtp.attempts >= existingOtp.maxAttempts) {
        existingOtp.blocked = true;
        existingOtp.blockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        await existingOtp.save();
        return res.status(429).json({
          success: false,
          message: "Too many invalid attempts. Try again later.",
        });
      }

      // ================= EXPIRED =================

      if (existingOtp.expiresAt < new Date()) {
        return res.status(400).json({ success: false, message: "OTP expired" });
      }

      const user = await User.findOne({ mobile });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found. Please signup first.",
        });
      }

      user.isMobileVerified = true;
      user.lastLoginAt = new Date();
      user.lastActiveAt = new Date();
      await user.save();

      existingOtp.verified = true;
      await existingOtp.save();

      const token = generateToken(user);

      await Otp.deleteMany({ mobile, purpose: "login" });

      return res.json({ success: true, token, user: sanitizeUser(user) });
    }

    // ======================================================
    // ================= INVALID ============================
    // ======================================================

    return res.status(400).json({ success: false, message: "Invalid login mode" });

  } catch (error) {
    console.log("LOGIN ERROR:", error.response?.data || error.message || error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ======================================================
// ================= REGISTER SEND OTP ==================
// ======================================================

router.post("/register-send-otp", async (req, res) => {
  try {
    const { mobile } = req.body;
    console.log("Mobile received:", mobile);

    if (!mobile) {
      return res.status(400).json({ success: false, message: "Mobile required" });
    }

    const existingUser = await User.findOne({ mobile });
    console.log("User found:", existingUser);

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const existingOtp = await Otp.findOne({ mobile, purpose: "signup" });

    // ================= COOLDOWN =================

    if (existingOtp?.resendAvailableAt > new Date()) {
      const seconds = Math.ceil(
        (existingOtp.resendAvailableAt - new Date()) / 1000
      );
      return res.status(429).json({
        success: false,
        message: `Please wait ${seconds}s before requesting another OTP`,
      });
    }

    const otp = generateOtp();

    await Otp.deleteMany({ mobile, purpose: "signup" });

    await Otp.create({
      mobile,
      otp,
      type: "sms",
      purpose: "signup",
      resendAvailableAt: new Date(Date.now() + 30 * 1000),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    await sendSMS(
      mobile,
      `Your Housify Realty OTP is ${otp}. Do not share this OTP with anyone.`
    );

    res.json({ success: true, message: "OTP sent successfully" });

  } catch (error) {
    console.log("REGISTER OTP ERROR:", error.response?.data || error.message || error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ======================================================
// ================= REGISTER ===========================
// ======================================================

router.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, password, otp, role } = req.body;

    if (!name || !mobile || !password || !otp) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    const existingOtp = await Otp.findOne({ mobile, otp, purpose: "signup" });

    if (!existingOtp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (existingOtp.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const allowedRoles = ["buyer", "seller", "builder", "agent"];
    const finalRole = allowedRoles.includes(role) ? role : "buyer";

    const user = await User.create({
      name,
      email,
      mobile,
      password,
      role: finalRole,
      authProvider: "email",
      isMobileVerified: true,
    });

    // ================= WELCOME NOTIFICATION =================

    await user.addNotification({
      type: "welcome",
      title: "Welcome To Real Estate Platform",
      message: "Your account has been created successfully.",
      icon: "🎉",
    });

    const token = generateToken(user);

    await Otp.deleteMany({ mobile, purpose: "signup" });

    res.json({
      success: true,
      message: "Account created successfully",
      token,
      user: sanitizeUser(user),
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error.response?.data || error.message || error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ======================================================
// ================= GET NOTIFICATIONS ==================
// ======================================================

router.get("/notifications", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      notifications: user.notifications || [],
      unreadCount: user.unreadNotifications || 0,
    });

  } catch (error) {
    console.log("GET NOTIFICATIONS ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ======================================================
// ================= MARK ALL AS READ ===================
// ======================================================

router.patch("/notifications/read-all", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await user.markAllNotificationsRead();

    res.json({ success: true, message: "All notifications marked as read" });

  } catch (error) {
    console.log("READ NOTIFICATIONS ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ======================================================
// ================= DELETE NOTIFICATION ================
// ======================================================

router.delete("/notifications/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.notifications = user.notifications.filter(
      (notification) => notification._id.toString() !== req.params.id
    );

    user.unreadNotifications = user.notifications.filter(
      (notification) => !notification.isRead
    ).length;

    await user.save();

    res.json({ success: true, message: "Notification deleted successfully" });

  } catch (error) {
    console.log("DELETE NOTIFICATION ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ======================================================
// ================= CLEAR ALL NOTIFICATIONS ============
// ======================================================

router.delete("/notifications", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.notifications = [];
    user.unreadNotifications = 0;
    await user.save();

    res.json({ success: true, message: "All notifications cleared successfully" });

  } catch (error) {
    console.log("CLEAR NOTIFICATIONS ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ======================================================
// ================= FORGOT PASSWORD OTP ================
// ======================================================

router.post("/forgot-password/send-otp", async (req, res) => {
  try {
    const { email, mobile } = req.body;

    if (!email && !mobile) {
      return res.status(400).json({ success: false, message: "Email or mobile required" });
    }

    const user = await User.findOne({ $or: [{ email }, { mobile }] });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const existingOtp = await Otp.findOne({
      $or: [{ email }, { mobile }],
      purpose: "forgot-password",
    });

    // ================= COOLDOWN =================

    if (existingOtp?.resendAvailableAt > new Date()) {
      const seconds = Math.ceil(
        (existingOtp.resendAvailableAt - new Date()) / 1000
      );
      return res.status(429).json({
        success: false,
        message: `Please wait ${seconds}s before requesting another OTP`,
      });
    }

    const otp = generateOtp();

    await Otp.deleteMany({ email, mobile, purpose: "forgot-password" });

    await Otp.create({
      email,
      mobile,
      otp,
      type: "sms",
      purpose: "forgot-password",
      resendAvailableAt: new Date(Date.now() + 30 * 1000),
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    await sendSMS(
      mobile,
      `Your Housify Realty OTP is ${otp}. Do not share this OTP with anyone.`
    );

    res.json({ success: true, message: "Reset OTP sent" });

  } catch (error) {
    console.log("FORGOT PASSWORD OTP ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ======================================================
// ================= RESET PASSWORD =====================
// ======================================================

router.post("/reset-password", async (req, res) => {
  try {
    const { email, mobile, otp, newPassword } = req.body;

    if (!otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "OTP & new password required",
      });
    }

    const existingOtp = await Otp.findOne({
      otp,
      $or: [{ email }, { mobile }],
      purpose: "forgot-password",
    });

    if (!existingOtp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (existingOtp.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const user = await User.findOne({
      $or: [{ email }, { mobile }],
    }).select("+password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    await Otp.deleteMany({ email, mobile, purpose: "forgot-password" });

    res.json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.log("RESET PASSWORD ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ======================================================
// ================= EXPORT =============================
// ======================================================

module.exports = router;
