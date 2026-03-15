const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "seller", "builder", "agent", "buyer"],
    default: "buyer",
  },
  isVerified: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);