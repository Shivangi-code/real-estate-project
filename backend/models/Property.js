const mongoose =
  require("mongoose");

// ======================================================
// ================= IMAGE MODERATION SCHEMA ============
// ======================================================

const imageSchema =
  new mongoose.Schema(

    {
      // ======================================================
      // ================= IMAGE FILE =========================
      // ======================================================

      filename: {
        type: String,
        default: "",
        trim: true,
      },

      url: {
        type: String,
        default: "",
        trim: true,
      },

      // ======================================================
      // ================= IMAGE OWNER ========================
      // ======================================================

      uploadedBy: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      // ======================================================
      // ================= IMAGE STATUS =======================
      // ======================================================

      status: {

        type: String,

        enum: [

          "pending",

          "approved",

          "rejected",

          "deleted",
        ],

        default: "pending",

        lowercase: true,
      },

      // ======================================================
      // ================= IMAGE MODERATION ===================
      // ======================================================

      approvedAt: {
        type: Date,
      },

      rejectedAt: {
        type: Date,
      },

      deletedAt: {
        type: Date,
      },

      approvedBy: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      rejectedBy: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      deletedBy: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      // ================= RESTORE =================

      restoredAt: {
        type: Date,
      },

      restoredBy: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      rejectionReason: {

        type: String,

        trim: true,

        default: "",
      },

      moderationNote: {

        type: String,

        trim: true,

        default: "",
      },

      lastModeratedAt: {
        type: Date,
      },

      lastModeratedBy: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      verificationLogs: {

        type: [

          {

            action: {

              type: String,

              enum: [

                "pending",

                "approved",

                "rejected",

                "deleted",

                "restored",

              ],

            },

            previousStatus: {

              type: String,

            },

            newStatus: {

              type: String,

            },

            performedBy: {

              type:
                mongoose.Schema.Types
                  .ObjectId,

              ref: "User",

            },

            performedByName: {

              type: String,

              default: "",

            },

            reason: {

              type: String,

              default: "",

            },

            note: {

              type: String,

              default: "",

            },

            performedAt: {

              type: Date,

              default: Date.now,

            },

          },

        ],

        default: [],

      },
    },

    {
      timestamps: true,
      
    }

  );

// ======================================================
// ================= VERIFICATION LOG SCHEMA ============
// ======================================================

const verificationLogSchema =
  new mongoose.Schema(

    {
      previousStatus: {

        type: String,

        default: "",
      },

      newStatus: {

        type: String,

        default: "",
      },

      actionBy: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      actionByName: {

        type: String,

        trim: true,

        default: "",
      },

      note: {

        type: String,

        trim: true,

        default: "",
      },

      rejectionReason: {

        type: String,

        trim: true,

        default: "",
      },

      timestamp: {

        type: Date,

        default: Date.now,
      },
    },

    {
      _id: false,
    }
  );

// ======================================================
// ================= PROPERTY SCHEMA ====================
// ======================================================

const propertySchema =
  new mongoose.Schema(

    {
      // ======================================================
      // ================= UNIQUE PROPERTY ID ================
      // ======================================================

      propertyUniqueId: {

        type: String,

        unique: true,

        trim: true,
      },

      // ======================================================
      // ================= BASIC INFO =========================
      // ======================================================

      title: {

        type: String,

        required: true,

        trim: true,
      },

      description: {

        type: String,

        trim: true,

        default: "",
      },

      // ======================================================
      // ================= PRICE ==============================
      // ======================================================

      price: {

        type: Number,

        required: true,

        min: 0,

        default: 0,
      },

      priceUnit: {

        type: String,

        enum: [

          "lac",

          "cr",

          "thousand",
        ],

        default: "lac",

        lowercase: true,
      },

      // ======================================================
      // ================= AREA ===============================
      // ======================================================

      area: {

        type: Number,

        min: 0,

        default: 0,
      },

      areaUnit: {

        type: String,

        enum: [

          "sqft",

          "acre",
        ],

        default: "sqft",

        lowercase: true,
      },

      // ======================================================
      // ================= LOCATION ===========================
      // ======================================================

      location: {

        type: String,

        required: true,

        trim: true,
      },

      // ======================================================
      // ================= TYPE ===============================
      // ======================================================

      type: {

        type: String,

        trim: true,

        lowercase: true,

        index: true,
      },

      subType: {

        type: String,

        trim: true,

        default: "",
      },

      constructionStatus: {

        type: String,

        trim: true,

        lowercase: true,

        default: "",
      },

      // ======================================================
      // ================= BUSINESS STATUS ====================
      // ======================================================

      businessStatus: {

        type: String,

        enum: [

          "available",

          "sold",
        ],

        default: "available",

        lowercase: true,
      },

      underNegotiation: {

        type: Boolean,

        default: false,
      },

      // ======================================================
      // ================= IMAGES =============================
      // ======================================================

      image: {

        type: String,

        default: "",
      },

      images: {

        type: [imageSchema],

        default: [],
      },

      // ======================================================
      // ================= PROPERTY MODERATION ===============
      // ======================================================

      status: {

        type: String,

        enum: [

          "pending",

          "approved",

          "rejected",

          "deleted",
        ],

        default: "pending",

        lowercase: true,

        index: true,
      },

      // ================= APPROVAL =================

      approvedAt: {
        type: Date,
      },

      approvedBy: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      // ================= REJECTION ===============

      rejectedAt: {
        type: Date,
      },

      rejectedBy: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      rejectionReason: {

        type: String,

        trim: true,

        default: "",
      },

      // ================= DELETION ================

      deletedAt: {
        type: Date,
      },

      deletedBy: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      // ================= RESTORE =================

      restoredAt: {
        type: Date,
      },

      restoredBy: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      // ======================================================
      // ================= MODERATION =========================
      // ======================================================

      moderationNote: {

        type: String,

        trim: true,

        default: "",
      },

      lastModeratedAt: {
        type: Date,
      },

      lastModeratedBy: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",
      },

      verificationLogs: {

        type: [
          verificationLogSchema,
        ],

        default: [],
      },

      // ======================================================
      // ================= OWNER ==============================
      // ======================================================

      createdBy: {

        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,

        index: true,
      },

      createdByRole: {

        type: String,

        trim: true,

        default: "",
      },

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

      // ======================================================
      // ================= FEATURE FLAGS ======================
      // ======================================================

      featured: {

        type: Boolean,

        default: false,
      },

      premiumListing: {

        type: Boolean,

        default: false,
      },

      // ======================================================
      // ================= ANALYTICS ==========================
      // ======================================================

      totalViews: {

        type: Number,

        default: 0,

        min: 0,
      },

      totalInquiries: {

        type: Number,

        default: 0,

        min: 0,
      },
    },

    {
      timestamps: true,
    }
  );

// ======================================================
// ================= PERFORMANCE INDEXES ================
// ======================================================

propertySchema.index({
  status: 1,
  createdAt: -1,
});

propertySchema.index({
  createdBy: 1,
  createdAt: -1,
});

propertySchema.index({
  businessStatus: 1,
});

propertySchema.index({
  featured: 1,
});

propertySchema.index({
  premiumListing: 1,
});

// ======================================================
// ================= AUTO PROPERTY ID ===================
// ======================================================

propertySchema.pre(

  "save",

  async function (
    next
  ) {

    try {

      // ======================================================
      // ================= AUTO ID ============================
      // ======================================================

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

      // ======================================================
      // ================= SAFE IMAGE =========================
      // ======================================================

      if (

        !this.image &&

        Array.isArray(
          this.images
        ) &&

        this.images.length > 0

      ) {

        this.image =
          this.images[0]?.url || "";
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

  mongoose.models
    .Property ||

  mongoose.model(
    "Property",
    propertySchema
  );