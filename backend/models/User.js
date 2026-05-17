const mongoose =
  require("mongoose");

const bcrypt =
  require("bcryptjs");

// ======================================================
// ================= USER SCHEMA ========================
// ======================================================

const userSchema =
  new mongoose.Schema(
    {
      // ======================================================
      // ================= BASIC INFO =========================
      // ======================================================

      name: {
        type: String,
        trim: true,
        default: "",
      },

      // ======================================================
      // ================= EMAIL ==============================
      // ======================================================

      email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true,
        default: null,
      },

      // ======================================================
      // ================= MOBILE =============================
      // ======================================================

      mobile: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        default: null,
      },

      // ======================================================
      // ================= PASSWORD ===========================
      // ======================================================

      password: {
        type: String,
        minlength: 6,
        default: null,
        select: false,
      },

      // ======================================================
      // ================= AUTH PROVIDER ======================
      // ======================================================

      authProvider: {
        type: String,

        enum: [
          "email",
          "otp",
          "google",
        ],

        default: "email",
      },

      // ======================================================
      // ================= USER ROLE ==========================
      // ======================================================

      role: {
        type: String,

        enum: [
          "buyer",
          "seller",
          "builder",
        ],

        default: "buyer",
      },

      // ======================================================
      // ================= UNIQUE USER ID =====================
      // ======================================================

      userUniqueId: {
        type: String,
        unique: true,
        trim: true,
      },

      // ======================================================
      // ================= GOOGLE =============================
      // ======================================================

      googleId: {
        type: String,
        default: null,
      },

      // ======================================================
      // ================= PROFILE ============================
      // ======================================================

      profileImage: {
        type: String,
        default: "",
      },

      // ======================================================
      // ================= VERIFICATION =======================
      // ======================================================

      isEmailVerified: {
        type: Boolean,
        default: false,
      },

      isMobileVerified: {
        type: Boolean,
        default: false,
      },

      isBlocked: {
        type: Boolean,
        default: false,
      },

      // ======================================================
      // ================= BUSINESS ===========================
      // ======================================================

      whatsappNumber: {
        type: String,
        default: "",
        trim: true,
      },

      companyName: {
        type: String,
        default: "",
        trim: true,
      },

      businessAddress: {
        type: String,
        default: "",
        trim: true,
      },
    },

    {
      timestamps: true,
    }
  );

// ======================================================
// ================= HASH PASSWORD ======================
// ======================================================

userSchema.pre(
  "save",

  async function (
    next
  ) {

    try {

      // ================= HASH PASSWORD =================

      if (
        this.isModified(
          "password"
        ) &&
        this.password
      ) {

        const salt =
          await bcrypt.genSalt(
            10
          );

        this.password =
          await bcrypt.hash(
            this.password,
            salt
          );
      }

      // ================= UNIQUE USER ID =================

      if (
        !this.userUniqueId
      ) {

        const random =
          Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

        this.userUniqueId =
          `USR-${random}`;
      }

      next();

    } catch (error) {

      next(error);
    }
  }
);

// ======================================================
// ================= MATCH PASSWORD =====================
// ======================================================

userSchema.methods.matchPassword =
  async function (
    enteredPassword
  ) {

    if (
      !this.password
    ) {

      return false;
    }

    return await bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

// ======================================================
// ================= INDEXES ============================
// ======================================================

userSchema.index({
  role: 1,
});

// ======================================================
// ================= EXPORT =============================
// ======================================================

module.exports =
  mongoose.models.User ||

  mongoose.model(
    "User",
    userSchema
  );