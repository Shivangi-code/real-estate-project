const Property = require(
  "../models/Property"
);

// ======================================================
// ================= COMMON COUNTS ======================
// ======================================================

const getPropertyCounts =
  async () => {

    const total =
      await Property.countDocuments();

    const pending =
      await Property.countDocuments({

        status:
          "pending",
      });

    const approved =
      await Property.countDocuments({

        status:
          "approved",
      });

    const rejected =
      await Property.countDocuments({

        status:
          "rejected",
      });

    const deleted =
      await Property.countDocuments({

        status:
          "deleted",
      });

    return {

      total,

      pending,

      approved,

      rejected,

      deleted,
    };
  };

// ======================================================
// ================= SOCKET NOTIFICATION ================
// ======================================================

const sendRealtimeNotification =
  (
    req,
    payload
  ) => {

    try {

      const sendNotification =

        req.app.get(

          "sendModerationNotification"
        );

      if (
        sendNotification
      ) {

        sendNotification(
          payload
        );
      }

    } catch (
      error
    ) {

      console.log(

        "Realtime Notification Error ❌",

        error
      );
    }
  };

// ======================================================
// ================= CREATE NOTIFICATION PAYLOAD ========
// ======================================================

const createNotificationPayload =
  ({
    property,
    status,
    moderationReason,
    moderationNote,
    previousStatus,
  }) => {

    let title =
      "";

    let message =
      "";

    let icon =
      "";

    // ======================================================
    // ================= APPROVED ===========================
    // ======================================================

    if (
      status ===
      "approved"
    ) {

      title =
        "Property Approved";

      message =
        `${property.title} has been approved and is now live on the platform.`;

      icon =
        "✅";
    }

    // ======================================================
    // ================= REJECTED ===========================
    // ======================================================

    if (
      status ===
      "rejected"
    ) {

      title =
        "Property Rejected";

      message =
        moderationReason

          ? `Reason: ${moderationReason}`

          : `${property.title} was rejected by admin moderation.`;

      icon =
        "❌";
    }

    // ======================================================
    // ================= PENDING ============================
    // ======================================================

    if (
      status ===
      "pending"
    ) {

      title =
        "Property Moved To Pending";

      message =
        `${property.title} is under moderation review again.`;

      icon =
        "⏳";
    }

    // ======================================================
    // ================= DELETED ============================
    // ======================================================

    if (
      status ===
      "deleted"
    ) {

      title =
        "Property Archived";

      message =
        `${property.title} was moved to archived properties.`;

      icon =
        "🗑";
    }

    return {

      type:
        "property-moderation",

      title,

      message,

      icon,

      propertyId:
        property._id,

      propertyTitle:
        property.title,

      status,

      previousStatus,

      moderationReason:
        moderationReason ||
        "",

      moderationNote:
        moderationNote ||
        "",

      createdAt:
        new Date(),
    };
  };

// ======================================================
// ================= GET PENDING ========================
// ======================================================

exports.getPendingProperties =
  async (req, res) => {

    try {

      const properties =
        await Property.find({

          status:
            "pending",
        })

          .populate(

            "createdBy",

            "name email role uniqueUserId"
          )

          .sort({

            createdAt: -1,
          });

      const counts =
        await getPropertyCounts();

      res.status(200).json({

        success: true,

        total:
          properties.length,

        counts,

        properties,
      });

    } catch (
      error
    ) {

      console.log(

        "Pending Properties Error ❌",

        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",
      });
    }
  };

// ======================================================
// ================= GET APPROVED =======================
// ======================================================

exports.getApprovedProperties =
  async (req, res) => {

    try {

      const properties =
        await Property.find({

          status:
            "approved",
        })

          .populate(

            "createdBy",

            "name email role uniqueUserId"
          )

          .sort({

            createdAt: -1,
          });

      const counts =
        await getPropertyCounts();

      res.status(200).json({

        success: true,

        total:
          properties.length,

        counts,

        properties,
      });

    } catch (
      error
    ) {

      console.log(

        "Approved Properties Error ❌",

        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",
      });
    }
  };

// ======================================================
// ================= GET REJECTED =======================
// ======================================================

exports.getRejectedProperties =
  async (req, res) => {

    try {

      const properties =
        await Property.find({

          status:
            "rejected",
        })

          .populate(

            "createdBy",

            "name email role uniqueUserId"
          )

          .sort({

            createdAt: -1,
          });

      const counts =
        await getPropertyCounts();

      res.status(200).json({

        success: true,

        total:
          properties.length,

        counts,

        properties,
      });

    } catch (
      error
    ) {

      console.log(

        "Rejected Properties Error ❌",

        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",
      });
    }
  };

// ======================================================
// ================= GET DELETED ========================
// ======================================================

exports.getDeletedProperties =
  async (req, res) => {

    try {

      const properties =
        await Property.find({

          status:
            "deleted",
        })

          .populate(

            "createdBy",

            "name email role uniqueUserId"
          )

          .sort({

            createdAt: -1,
          });

      const counts =
        await getPropertyCounts();

      res.status(200).json({

        success: true,

        total:
          properties.length,

        counts,

        properties,
      });

    } catch (
      error
    ) {

      console.log(

        "Deleted Properties Error ❌",

        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",
      });
    }
  };

// ======================================================
// ================= IMAGE NOTIFICATION ==================
// ======================================================

// ======================================================
// ================= CREATE IMAGE PAYLOAD ===============
// ======================================================

// ======================================================
// ================= ADMIN DASHBOARD STATS ==============
// ======================================================

exports.getAdminPropertyStats =
  async (req, res) => {

    try {

      const counts =
        await getPropertyCounts();

      res.status(200).json({

        success: true,

        stats:
          counts,
      });

    } catch (
      error
    ) {

      console.log(

        "Admin Property Stats Error ❌",

        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",
      });
    }
  };

// ======================================================
// ================= UPDATE PROPERTY STATUS =============
// ======================================================

exports.updatePropertyStatus =
  async (req, res) => {

    try {

      const propertyId =
        req.params.id;

      const {

        status,

        moderationReason,

        moderationNote,

      } = req.body;

      // ======================================================
      // ================= VALID STATUS =======================
      // ======================================================

      const validStatuses = [

        "pending",

        "approved",

        "rejected",

        "deleted",

      ];

      if (

        !validStatuses.includes(
          status
        )

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid status update",

        });

      }

      // ======================================================
      // ================= FIND PROPERTY ======================
      // ======================================================

      const property =
        await Property.findById(
          propertyId
        )

          .populate(

            "createdBy",

            "name email role uniqueUserId"

          );

      if (
        !property
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Property not found",

        });

      }

      // ======================================================
      // ================= PREVIOUS STATUS ====================
      // ======================================================

      const previousStatus =
        property.status;

      // ======================================================
      // ================= AVOID SAME STATUS ==================
      // ======================================================

      if (
        previousStatus ===
        status
      ) {

        return res.status(400).json({

          success: false,

          message:
            `Property is already ${status}`,

        });

      }

      // ======================================================
      // ================= UPDATE STATUS ======================
      // ======================================================

      property.status =
        status;

      property.lastModeratedAt =
        new Date();

      property.lastModeratedBy =
        req.user.id;

      property.moderationNote =
        moderationNote || "";

      // ======================================================
      // ================= APPROVED ===========================
      // ======================================================

      if (
        status ===
        "approved"
      ) {

        property.approvedAt =
          new Date();

        property.approvedBy =
          req.user.id;

        property.rejectedAt =
          null;

        property.rejectedBy =
          null;

        property.deletedAt =
          null;

        property.deletedBy =
          null;

        property.rejectionReason =
          "";

      }

      // ======================================================
      // ================= REJECTED ===========================
      // ======================================================

      if (
        status ===
        "rejected"
      ) {

        property.rejectedAt =
          new Date();

        property.rejectedBy =
          req.user.id;

        property.rejectionReason =
          moderationReason || "";

      }

      // ======================================================
      // ================= DELETED ============================
      // ======================================================

      if (
        status ===
        "deleted"
      ) {

        property.deletedAt =
          new Date();

        property.deletedBy =
          req.user.id;

      }

      // ======================================================
      // ================= BACK TO PENDING ====================
      // ======================================================

      if (
        status ===
        "pending"
      ) {

        property.approvedAt =
          null;

        property.approvedBy =
          null;

        property.rejectedAt =
          null;

        property.rejectedBy =
          null;

        property.deletedAt =
          null;

        property.deletedBy =
          null;

        property.rejectionReason =
          "";

      }

      // ======================================================
      // ================= VERIFICATION LOG ===================
      // ======================================================

      property.verificationLogs.push({

        previousStatus,

        newStatus:
          status,

        actionBy:
          req.user.id,

        actionByName:
          req.user.name || "",

        note:
          moderationNote || "",

        rejectionReason:
          moderationReason || "",

        timestamp:
          new Date(),

      });

      // ======================================================
      // ================= SAVE PROPERTY ======================
      // ======================================================

      await property.save();

      // ======================================================
      // ================= SOCKET NOTIFICATION ===============
      // ======================================================

      const notificationPayload =

        createNotificationPayload({

          property,

          status,

          moderationReason,

          moderationNote,

          previousStatus,

        });

      sendRealtimeNotification(

        req,

        {

          ownerId:
            property.createdBy?._id?.toString(),

          notification:
            notificationPayload,

        }

      );

      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      return res.status(200).json({

        success: true,

        message:
          `Property moved to ${status} successfully`,

        property,

        notification:
          notificationPayload,

      });

    } catch (
      error
    ) {

      console.log(

        "Update Property Status Error ❌",

        error

      );

      return res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };

// ======================================================
// ================= IMAGE MODERATION ====================
// ======================================================

// ======================================================
// ================= UPDATE IMAGE STATUS ================
// ======================================================

exports.updateImageStatus =
  async (req, res) => {

    try {

      // ======================================================
      // ================= REQUEST DATA ========================
      // ======================================================

      const {

        propertyId,

        imageId,

      } = req.params;

      const {

        status,

        moderationReason,

        moderationNote,

      } = req.body;

      // ======================================================
      // ================= VALID STATUS ========================
      // ======================================================

      const validStatuses = [

        "pending",

        "approved",

        "rejected",

        "deleted",

      ];

      if (

        !validStatuses.includes(
          status
        )

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid image status",

        });

      }

      // ======================================================
      // ================= FIND PROPERTY =======================
      // ======================================================

      const property =
        await Property.findById(
          propertyId
        )

          .populate(

            "createdBy",

            "name email role userUniqueId"

          )

          .populate(

            "images.uploadedBy",

            "name email role userUniqueId"

          );

      if (
        !property
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Property not found",

        });

      }

      // ======================================================
      // ================= FIND IMAGE ==========================
      // ======================================================

      const image =
        property.images.id(
          imageId
        );

      if (
        !image
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Image not found",

        });

      }

      // ======================================================
      // ================= PREVIOUS STATUS =====================
      // ======================================================

      const previousStatus =
        image.status;

      // ======================================================
      // ================= AVOID SAME STATUS ===================
      // ======================================================

      if (
        previousStatus ===
        status
      ) {

        return res.status(400).json({

          success: false,

          message:
            `Image is already ${status}`,

        });

      }

      // ======================================================
      // ================= UPDATE IMAGE STATUS =================
      // ======================================================

      image.status =
        status;

      // ======================================================
      // ================= COMMON MODERATION ===================
      // ======================================================

      image.lastModeratedAt =
        new Date();

      image.lastModeratedBy =
        req.user._id;

      image.moderationNote =
        moderationNote || "";

      // ======================================================
      // ================= APPROVED ============================
      // ======================================================

      if (
        status ===
        "approved"
      ) {

        image.approvedAt =
          new Date();

        image.approvedBy =
          req.user._id;

        image.rejectedAt =
          null;

        image.rejectedBy =
          null;

        image.deletedAt =
          null;

        image.deletedBy =
          null;

        image.rejectionReason =
          "";

      }

      // ======================================================
      // ================= REJECTED ============================
      // ======================================================

      if (
        status ===
        "rejected"
      ) {

        image.rejectedAt =
          new Date();

        image.rejectedBy =
          req.user._id;

        image.rejectionReason =
          moderationReason || "";

      }

      // ======================================================
      // ================= DELETED =============================
      // ======================================================

      if (
        status ===
        "deleted"
      ) {

        image.deletedAt =
          new Date();

        image.deletedBy =
          req.user._id;

      }

      // ======================================================
      // ================= BACK TO PENDING =====================
      // ======================================================

      if (
        status ===
        "pending"
      ) {

        image.approvedAt =
          null;

        image.approvedBy =
          null;

        image.rejectedAt =
          null;

        image.rejectedBy =
          null;

        image.deletedAt =
          null;

        image.deletedBy =
          null;

        image.rejectionReason =
          "";

      }

      // ======================================================
      // ================= IMAGE VERIFICATION LOG ==============
      // ======================================================

      if (
        Array.isArray(
          image.verificationLogs
        )
      ) {

        image.verificationLogs.push({

          action:
            status,

          previousStatus,

          newStatus:
            status,

          performedBy:
            req.user._id,

          performedByName:
            req.user.name || "",

          reason:
            moderationReason || "",

          note:
            moderationNote || "",

          performedAt:
            new Date(),

        });

      }

      // ======================================================
      // ================= UPDATE COVER IMAGE ==================
      // ======================================================

      const approvedImages =
        property.images.filter(

          (img) =>
            img.status ===
            "approved"

        );

      property.image =
        approvedImages.length > 0

          ? approvedImages[0].url

          : "";

      // ======================================================
      // ================= RESTORE =============================
      // ======================================================

      if (

        previousStatus ===
          "deleted"

        &&

        (
          status ===
            "pending"

          ||

          status ===
            "approved"
        )

      ) {

        image.restoredAt =
          new Date();

        image.restoredBy =
          req.user._id;

      }

      // ======================================================
      // ================= SAVE PROPERTY =======================
      // ======================================================

      await property.save();

      // ======================================================
      // ================= RESPONSE ============================
      // ======================================================

      return res.status(200).json({

        success: true,

        message:
          `Image moved to ${status} successfully`,

        property,

        image,

      });

    } catch (error) {

      console.log(

        "Update Image Status Error ❌",

        error

      );

      return res.status(500).json({

        success: false,

        message:
          "Server Error",

      });

    }

  };


// ======================================================
// ================= GET SINGLE PROPERTY ADMIN ==========
// ======================================================

exports.getSinglePropertyAdmin =
  async (req, res) => {

    try {
      console.log(
        "✅ ADMIN PROPERTY REVIEW:",
        req.params.id
      );
      const property =
        await Property.findById(
          req.params.id
        )

          .populate(

            "createdBy",

            "name email role userUniqueId"
          )

          .populate(
            "images.uploadedBy",
            "name email role userUniqueId"
          );

      console.log(
        JSON.stringify(
          property.images[0],
          null,
          2
        )
      );
      // ======================================================
      // ================= PROPERTY NOT FOUND =================
      // ======================================================

      if (!property) {

        return res.status(404).json({

          success: false,

          message:
            "Property not found",
        });
      }


      // ======================================================
      // ================= IMAGE COUNTS =======================
      // ======================================================

      const imageStats = {

        total:
          property.images
            .length,

        approved:
          property.images.filter(
            (img) =>
              img.status ===
              "approved"
          ).length,

        pending:
          property.images.filter(
            (img) =>
              img.status ===
              "pending"
          ).length,

        rejected:
          property.images.filter(
            (img) =>
              img.status ===
              "rejected"
          ).length,

        deleted:
          property.images.filter(
            (img) =>
              img.status ===
              "deleted"
          ).length,
      };

      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        imageStats,

        property,
      });

    } catch (
      error
    ) {

      console.log(

        "Get Single Admin Property Error ❌",

        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",
      });
    }
  };