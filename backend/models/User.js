const mongoose =
  require("mongoose");

const bcrypt =
  require("bcryptjs");

// ======================================================
// ================= NOTIFICATION SCHEMA ================
// ======================================================

const notificationSchema =
  new mongoose.Schema({

    // ======================================================
    // ================= TYPE ===============================
    // ======================================================

    type: {
      type: String,
      default:
        "general",
    },

    // ======================================================
    // ================= TITLE ==============================
    // ======================================================

    title: {
      type: String,
      trim: true,
      default: "",
    },

    // ======================================================
    // ================= MESSAGE ============================
    // ======================================================

    message: {
      type: String,
      trim: true,
      default: "",
    },

    // ======================================================
    // ================= ICON ===============================
    // ======================================================

    icon: {
      type: String,
      default:
        "🔔",
    },

    // ======================================================
    // ================= STATUS =============================
    // ======================================================

    status: {
      type: String,
      default: "",
    },

    // ======================================================
    // ================= PROPERTY ===========================
    // ======================================================

    propertyId: {

      type:
        mongoose.Schema.Types
          .ObjectId,

      ref: "Property",

      default: null,
    },

    propertyTitle: {
      type: String,
      default: "",
    },

    // ======================================================
    // ================= READ STATUS ========================
    // ======================================================

    isRead: {
      type: Boolean,
      default: false,
    },

    // ======================================================
    // ================= TIMESTAMP ==========================
    // ======================================================

    createdAt: {
      type: Date,
      default:
        Date.now,
    },

  });

// ======================================================
// ================= USER SCHEMA ========================
// ======================================================

const userSchema =
  new mongoose.Schema(
    {

      // ======================================================
      // ================= BASIC INFO =========================
      // ======================================================

      name: {
        type: String,
        trim: true,
        default: "",
      },

      // ======================================================
      // ================= EMAIL ==============================
      // ======================================================

      email: {
        type: String,

        unique: true,

        sparse: true,

        trim: true,

        lowercase: true,

        default: null,
      },

      // ======================================================
      // ================= MOBILE =============================
      // ======================================================

      mobile: {
        type: String,

        unique: true,

        sparse: true,

        trim: true,

        default: null,
      },

      // ======================================================
      // ================= PASSWORD ===========================
      // ======================================================

      password: {
        type: String,

        minlength: 6,

        default: null,

        select: false,
      },

      // ======================================================
      // ================= AUTH PROVIDER ======================
      // ======================================================

      authProvider: {
        type: String,

        enum: [

          "email",

          "otp",

          "google",
        ],

        default:
          "email",
      },

      // ======================================================
      // ================= USER ROLE ==========================
      // ======================================================

      role: {
        type: String,

        enum: [

          "buyer",

          "seller",

          "builder",

          "admin",

          "agent",
        ],

        default:
          "buyer",
      },

      // ======================================================
      // ================= UNIQUE USER ID =====================
      // ======================================================

      userUniqueId: {
        type: String,

        unique: true,

        trim: true,
      },

      // ======================================================
      // ================= GOOGLE =============================
      // ======================================================

      googleId: {
        type: String,
        default: null,
      },

      // ======================================================
      // ================= PROFILE ============================
      // ======================================================

      profileImage: {
        type: String,
        default: "",
      },

      // ======================================================
      // ================= VERIFICATION =======================
      // ======================================================

      isEmailVerified: {
        type: Boolean,
        default: false,
      },

      isMobileVerified: {
        type: Boolean,
        default: false,
      },

      isBlocked: {
        type: Boolean,
        default: false,
      },

      // ======================================================
      // ================= BUSINESS ===========================
      // ======================================================

      whatsappNumber: {
        type: String,
        default: "",
        trim: true,
      },

      companyName: {
        type: String,
        default: "",
        trim: true,
      },

      businessAddress: {
        type: String,
        default: "",
        trim: true,
      },

      // ======================================================
      // ================= NOTIFICATIONS ======================
      // ======================================================

      notifications: [

        notificationSchema,
      ],

      unreadNotifications: {
        type: Number,
        default: 0,
      },

      // ======================================================
      // ================= LAST ACTIVE ========================
      // ======================================================

      lastActiveAt: {
        type: Date,
        default:
          Date.now,
      },

      // ======================================================
      // ================= LOGIN TRACKING =====================
      // ======================================================

      lastLoginAt: {
        type: Date,
        default: null,
      },

    },

    {
      timestamps: true,
    }
  );

// ======================================================
// ================= HASH PASSWORD ======================
// ======================================================

userSchema.pre(

  "save",

  async function (
    next
  ) {

    try {

      // ======================================================
      // ================= HASH PASSWORD ======================
      // ======================================================

      if (

        this.isModified(
          "password"
        ) &&

        this.password
      ) {

        const salt =
          await bcrypt.genSalt(
            10
          );

        this.password =
          await bcrypt.hash(

            this.password,

            salt
          );
      }

      // ======================================================
      // ================= UNIQUE USER ID =====================
      // ======================================================

      if (
        !this.userUniqueId
      ) {

        const random =
          Math.random()

            .toString(36)

            .substring(2, 8)

            .toUpperCase();

        this.userUniqueId =
          `USR-${random}`;
      }

      next();

    } catch (
      error
    ) {

      next(error);
    }
  }
);

// ======================================================
// ================= MATCH PASSWORD =====================
// ======================================================

userSchema.methods.matchPassword =
  async function (
    enteredPassword
  ) {

    if (
      !this.password
    ) {

      return false;
    }

    return await bcrypt.compare(

      enteredPassword,

      this.password
    );
  };

// ======================================================
// ================= ADD NOTIFICATION ===================
// ======================================================

userSchema.methods.addNotification =
  async function (
    notificationData
  ) {

    this.notifications.unshift({

      type:
        notificationData.type ||

        "general",

      title:
        notificationData.title ||

        "",

      message:
        notificationData.message ||

        "",

      icon:
        notificationData.icon ||

        "🔔",

      status:
        notificationData.status ||

        "",

      propertyId:
        notificationData.propertyId ||

        null,

      propertyTitle:
        notificationData.propertyTitle ||

        "",
    });

    // ======================================================
    // ================= LIMIT STORAGE =======================
    // ======================================================

    if (
      this.notifications
        .length > 100
    ) {

      this.notifications =
        this.notifications.slice(
          0,
          100
        );
    }

    // ======================================================
    // ================= UNREAD COUNT ========================
    // ======================================================

    this.unreadNotifications += 1;

    await this.save();
  };

// ======================================================
// ================= MARK ALL READ ======================
// ======================================================

userSchema.methods.markAllNotificationsRead =
  async function () {

    this.notifications =
      this.notifications.map(

        (
          notification
        ) => ({

          ...notification.toObject(),

          isRead: true,
        })
      );

    this.unreadNotifications = 0;

    await this.save();
  };

// ======================================================
// ================= INDEXES ============================
// ======================================================

userSchema.index({
  role: 1,
});

userSchema.index({
  unreadNotifications: 1,
});

// ======================================================
// ================= EXPORT =============================
// ======================================================

module.exports =
  mongoose.models.User ||

  mongoose.model(
    "User",
    userSchema
  );