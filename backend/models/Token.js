const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ link to user
      required: true,
    },

    token: {
      type: String,
      required: true,
    },

    // 🔐 Optional but very useful
    device: {
      type: String,
      default: "unknown",
    },

    // ⏳ Auto expiry (Mongo will delete after time)
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "7d", // ✅ auto delete after 7 days
    },
  },
  { timestamps: true }
);

// ✅ Index for faster lookup
tokenSchema.index({ token: 1 });

module.exports = mongoose.model("Token", tokenSchema);