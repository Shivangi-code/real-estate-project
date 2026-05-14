const mongoose = require("mongoose");

// ================= STATUS HISTORY =================
const statusHistorySchema =
  new mongoose.Schema(
    {
      status: {
        type: String,

        enum: [
          "pending",
          "approved",
          "rejected",
          "deleted",
        ],

        required: true,
      },

      changedAt: {
        type: Date,
        default: Date.now,
      },

      changedBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        default: null,
      },
    },

    { _id: false }
  );

// ================= IMAGE SCHEMA =================
const propertyImageSchema =
  new mongoose.Schema(
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

        enum: [
          "pending",
          "approved",
          "rejected",
        ],

        default: "pending",
      },

      uploadedBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      verifiedBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        default: null,
      },

      verifiedAt: {
        type: Date,

        default: null,
      },
    },

    {
      timestamps: true,
    }
  );

// ================= PROPERTY SCHEMA =================
const propertySchema =
  new mongoose.Schema(
    {
      // ================= PROPERTY UNIQUE ID =================
      propertyUniqueId: {
        type: String,

        unique: true,

        trim: true,
      },

      // ================= BASIC INFO =================
      title: {
        type: String,

        trim: true,
      },

      price: {
        type: Number,

        default: 0,
      },

      location: {
        type: String,

        trim: true,
      },

      // ================= CATEGORY =================
      type: {
        type: String,

        trim: true,
      },

      subType: {
        type: String,

        trim: true,
      },

      constructionStatus: {
        type: String,

        trim: true,
      },

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
      },

      // ================= UNDER NEGOTIATION =================
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
      images: {
        type: [
          propertyImageSchema,
        ],

        default: [],
      },

      // ================= ADMIN MODERATION =================
      status: {
        type: String,

        enum: [
          "pending",
          "approved",
          "rejected",
          "deleted",
        ],

        default:
          function () {

            return this.createdByRole ===
              "admin"
              ? "approved"
              : "pending";
          },
      },

      // ================= OWNER =================
      createdBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      createdByRole: {
        type: String,

        enum: [
          "seller",
          "builder",
          "agent",
          "admin",
        ],

        default: "seller",
      },

      // ================= OWNER SNAPSHOT =================
      ownerUniqueId: {
        type: String,

        trim: true,

        default: "",
      },

      ownerName: {
        type: String,

        trim: true,

        default: "",
      },

      // ================= VERIFICATION =================
      verifiedBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,

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
        type: [
          statusHistorySchema,
        ],

        default:
          function () {

            return [
              {
                status:
                  this.createdByRole ===
                  "admin"
                    ? "approved"
                    : "pending",

                changedAt:
                  new Date(),
              },
            ];
          },
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

      // ================= FUTURE READY =================
      featured: {
        type: Boolean,

        default: false,
      },

      premiumListing: {
        type: Boolean,

        default: false,
      },

      whatsappEnabled: {
        type: Boolean,

        default: false,
      },
    },

    {
      timestamps: true,
    }
  );

// ================= AUTO GENERATE PROPERTY ID =================
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

// ================= INDEXES =================
propertySchema.index({
  status: 1,
});

propertySchema.index({
  businessStatus: 1,
});

propertySchema.index({
  underNegotiation: 1,
});

// ================= EXPORT =================
module.exports =
  mongoose.models.Property ||
  mongoose.model(
    "Property",
    propertySchema
  );