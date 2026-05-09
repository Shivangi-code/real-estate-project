const mongoose = require("mongoose");

// ================= STATUS HISTORY =================
const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "deleted"],
      required: true,
    },

    changedAt: {
      type: Date,
      default: Date.now,
    },

    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { _id: false }
);

// ================= IMAGE SCHEMA =================
const propertyImageSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// ================= PROPERTY SCHEMA =================
const propertySchema = new mongoose.Schema(
  {
    title: String,

    price: Number,

    location: String,

    // 🔥 Residential / Commercial / Agriculture
    type: String,

    subType: String,

    constructionStatus: String,

    description: String,

    // ================= MAIN IMAGE =================
    image: String,

    // ================= MULTIPLE IMAGES =================
    images: {
      type: [propertyImageSchema],
      default: [],
    },

    // ================= STATUS =================
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "deleted"],

      // ✅ AUTO APPROVE ADMIN LISTINGS
      default: function () {
        return this.createdByRole === "admin"
          ? "approved"
          : "pending";
      },
    },

    // ================= OWNER =================
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ✅ NEW FIELD
    createdByRole: {
      type: String,
      default: "seller",
    },

    // ================= VERIFICATION =================
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },

    // ================= TRACKING =================
    lastStatusChangedAt: {
      type: Date,
      default: Date.now,
    },

    statusHistory: {
      type: [statusHistorySchema],

      default: function () {
        return [
          {
            status:
              this.createdByRole === "admin"
                ? "approved"
                : "pending",

            changedAt: new Date(),
          },
        ];
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);