const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ================= USER SCHEMA =================
const userSchema = new mongoose.Schema(
  {
    // ================= BASIC INFO =================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // ================= USER ROLE =================
    role: {
      type: String,

      enum: [
        "user",
        "seller",
        "builder",
        "agent",
        "admin",
      ],

      default: "user",
    },

    // ================= UNIQUE USER ID =================
    userUniqueId: {
      type: String,
      unique: true,
      trim: true,
    },

    // ================= PROFILE =================
    profileImage: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    // ================= ACCOUNT STATUS =================
    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    // ================= FUTURE FEATURES =================
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

// ================= AUTO GENERATE USER ID =================
userSchema.pre(
  "save",

  async function (next) {

    try {

      // ================= HASH PASSWORD =================
      if (this.isModified("password")) {

        const salt =
          await bcrypt.genSalt(10);

        this.password =
          await bcrypt.hash(
            this.password,
            salt
          );
      }

      // ================= GENERATE UNIQUE USER ID =================
      if (!this.userUniqueId) {

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

// ================= PASSWORD MATCH =================
userSchema.methods.matchPassword =
  async function (
    enteredPassword
  ) {

    return await bcrypt.compare(
      enteredPassword,
      this.password
    );
  };

// ================= INDEXES =================


userSchema.index({
  role: 1,
});

// ================= EXPORT =================
module.exports =
  mongoose.models.User ||
  mongoose.model(
    "User",
    userSchema
  );