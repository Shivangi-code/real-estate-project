const mongoose = require("mongoose");

// ======================================================
// ================= PROPERTY SCHEMA ====================
// ======================================================

const propertySchema =
  new mongoose.Schema(
    {
      // ================= UNIQUE PROPERTY ID =================

      propertyUniqueId: {
        type: String,
        unique: true,
        trim: true,
      },

      // ================= BASIC INFO =================

      title: {
        type: String,
        required: true,
        trim: true,
      },

      price: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },

      // ================= AREA =================

      area: {
        type: Number,
        min: 0,
        default: 0,
      },

      // ================= AREA UNIT =================

      areaUnit: {
        type: String,

        enum: [
          "sqft",
          "acre",
        ],

        default: "sqft",

        lowercase: true,
      },

      // ================= LOCATION =================

      location: {
        type: String,
        required: true,
        trim: true,
      },

      // ================= TYPE =================

      type: {
        type: String,
        trim: true,
        lowercase: true,
      },

      // ================= SUB TYPE =================

      subType: {
        type: String,
        trim: true,
        default: "",
      },

      // ================= CONSTRUCTION =================

      constructionStatus: {
        type: String,
        trim: true,
        lowercase: true,
      },

      // ================= DESCRIPTION =================

      description: {
        type: String,
        trim: true,
      },

      // ================= BUSINESS STATUS =================

      businessStatus: {
        type: String,

        enum: [
          "available",
          "sold",
        ],

        default: "available",

        lowercase: true,
      },

      // ================= NEGOTIATION =================

      underNegotiation: {
        type: Boolean,
        default: false,
      },

      // ================= MAIN IMAGE =================

      image: {
        type: String,
        default: "",
      },

      // ================= MULTIPLE IMAGES =================

      images: [
        {
          filename: String,

          url: String,

          uploadedBy: {
            type:
              mongoose.Schema.Types
                .ObjectId,

            ref: "User",
          },

          status: {
            type: String,
            default:
              "approved",
          },
        },
      ],

      // ================= STATUS =================

      status: {
        type: String,

        enum: [
          "pending",
          "approved",
          "rejected",
        ],

        default: "approved",
      },

      // ================= OWNER =================

      createdBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      createdByRole: {
        type: String,
        default: "",
      },

      ownerUniqueId: {
        type: String,
        default: "",
      },

      ownerName: {
        type: String,
        default: "",
      },

      // ================= FEATURED =================

      featured: {
        type: Boolean,
        default: false,
      },

      // ================= PREMIUM =================

      premiumListing: {
        type: Boolean,
        default: false,
      },

      // ================= ANALYTICS =================

      totalViews: {
        type: Number,
        default: 0,
      },

      totalInquiries: {
        type: Number,
        default: 0,
      },
    },

    {
      timestamps: true,
    }
  );

// ======================================================
// ================= AUTO PROPERTY ID ===================
// ======================================================

propertySchema.pre(
  "save",

  async function (
    next
  ) {

    try {

      if (
        !this.propertyUniqueId
      ) {

        const random =
          Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

        this.propertyUniqueId =
          `RE-${random}`;
      }

      next();

    } catch (error) {

      next(error);
    }
  }
);

// ======================================================
// ================= EXPORT =============================
// ======================================================

module.exports =
  mongoose.models.Property ||

  mongoose.model(
    "Property",
    propertySchema
  );