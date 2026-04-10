const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    mobile: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      required: function () {
        return this.authProvider === "email";
      },
    },

    password: {
      type: String,
      select: false,
      required: function () {
        return this.authProvider === "email";
      },
    },

    googleId: {
      type: String,
    },

    authProvider: {
      type: String,
      enum: ["otp", "email", "google"],
      default: "otp",
    },

    role: {
      type: String,
      enum: ["buyer", "seller", "agent", "builder", "admin"],
      default: "buyer",
    },

    isMobileVerified: {
      type: Boolean,
      default: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);




module.exports = mongoose.model("User", userSchema);