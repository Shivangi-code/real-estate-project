const mongoose = require("mongoose");

// ================= STATUS HISTORY =================
const leadStatusHistorySchema =
  new mongoose.Schema(
    {
      status: {
        type: String,

        enum: [
          "new",
          "in-progress",
          "contacted",
          "closed",
          "spam",
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

      note: {
        type: String,
        trim: true,
        default: "",
      },
    },

    { _id: false }
  );

// ================= LEAD SCHEMA =================
const leadSchema =
  new mongoose.Schema(
    {
      // ================= TYPE =================
      leadType: {
        type: String,

        enum: [
          "property-inquiry",
          "contact-us",
        ],

        default:
          "property-inquiry",
      },

      // ================= PROPERTY =================
      propertyId: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Property",

        default: null,
      },

      propertyTitle: {
        type: String,
        trim: true,
        default: "",
      },

      propertyUniqueId: {
        type: String,
        trim: true,
        default: "",
      },

      // ================= BUYER =================
      buyerName: {
        type: String,
        required: true,
        trim: true,
      },

      buyerEmail: {
        type: String,
        trim: true,
        lowercase: true,
        default: "",
      },

      buyerMobile: {
        type: String,
        trim: true,
        required: true,
      },

      buyerCity: {
        type: String,
        trim: true,
        default: "",
      },

      // ================= MESSAGE =================
      message: {
        type: String,
        trim: true,
        default: "",
      },

      // ================= STATUS =================
      status: {
        type: String,

        enum: [
          "new",
          "in-progress",
          "contacted",
          "closed",
          "spam",
        ],

        default: "new",
      },

      // ================= ASSIGNMENT =================
      assignedTo: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        default: null,
      },

      // ================= OWNER =================
      propertyOwner: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        default: null,
      },

      // ================= SOURCE =================
      source: {
        type: String,

        enum: [
          "website",
          "contact-form",
          "whatsapp",
          "manual",
        ],

        default: "website",
      },

      // ================= PRIORITY =================
      priority: {
        type: String,

        enum: [
          "low",
          "medium",
          "high",
        ],

        default: "medium",
      },

      // ================= NOTES =================
      adminNotes: {
        type: String,
        trim: true,
        default: "",
      },

      // ================= TRACKING =================
      lastStatusChangedAt: {
        type: Date,
        default: Date.now,
      },

      statusHistory: {
        type: [
          leadStatusHistorySchema,
        ],

        default: [
          {
            status: "new",
            changedAt:
              new Date(),
          },
        ],
      },

      // ================= USER =================
      createdBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        default: null,
      },

      // ================= CONTACT INFO =================
      contactedAt: {
        type: Date,
        default: null,
      },

      closedAt: {
        type: Date,
        default: null,
      },

      // ================= FUTURE CRM =================
      whatsappSent: {
        type: Boolean,
        default: false,
      },

      emailSent: {
        type: Boolean,
        default: false,
      },

      aiScore: {
        type: Number,
        default: 0,
      },
    },

    {
      timestamps: true,
    }
  );

// ================= INDEXES =================
leadSchema.index({
  buyerName: "text",
  buyerEmail: "text",
  buyerMobile: "text",
  propertyTitle: "text",
});

// ================= EXPORT =================
module.exports =
  mongoose.model(
    "Lead",
    leadSchema
  );