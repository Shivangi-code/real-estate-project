const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    propertyTitle: {
      type: String,
      required: true,
    },

    buyerName: {
      type: String,
      required: true,
      trim: true,
    },

    buyerEmail: {
      type: String,
      trim: true,
      default: "",
    },

    buyerMobile: {
      type: String,
      trim: true,
      required: true,
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", leadSchema);