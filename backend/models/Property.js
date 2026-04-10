const mongoose = require("mongoose");

const propertyImageSchema = new mongoose.Schema(
  {
    filename: {
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

const propertySchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    location: String,
    type: String,
    subType: String,
    constructionStatus: String,
    description: String,
    image: String,
    images: {
      type: [propertyImageSchema],
      default: [],
    },
    status: {
      type: String,
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
