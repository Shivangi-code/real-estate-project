const express = require("express");

const router =
  express.Router();

const mongoose =
  require("mongoose");

// ======================================================
// ================= MODELS =============================
// ======================================================

const Property =
  require(
    "../models/Property"
  );

const Lead =
  require(
    "../models/Lead"
  );

// ======================================================
// ================= CONTROLLERS ========================
// ======================================================

const {

  // ======================================================
  // ================= VERIFICATION BOARDS ================
  // ======================================================

  getPendingProperties,

  getApprovedProperties,

  getRejectedProperties,

  getDeletedProperties,

  // ======================================================
  // ================= ANALYTICS ==========================
  // ======================================================

  getAdminPropertyStats,

  // ======================================================
  // ================= MODERATION =========================
  // ======================================================

  updatePropertyStatus,

  // ======================================================
  // ================= PROPERTY REVIEW ====================
  // ======================================================

  getSinglePropertyAdmin,

  // ================= UPDATE IMAGE STATUS ====================
  updateImageStatus,

} = require(
  "../controllers/adminPropertyController"
);
const {

  getAdminStats,

} = require(
  "../controllers/adminController"
);
// ======================================================
// ================= AUTH ===============================
// ======================================================

const {

  protect,

  authorizeRoles,

} = require(
  "../middleware/authMiddleware"
);

// ======================================================
// ================= ADMIN ACCESS =======================
// ======================================================

router.use(
  protect
);

router.use(
  authorizeRoles(
    "admin"
  )
);

// ======================================================
// ================= VALIDATE OBJECT ID =================
// ======================================================

const isValidId =
  (id) =>

    mongoose.Types
      .ObjectId
      .isValid(id);

// ======================================================
// ================= REALTIME EMITTER ===================
// ======================================================

const emitRealtimeUpdate =
  (
    req,
    property
  ) => {

    const io =
      req.app.get(
        "io"
      );

    if (io) {

      io.emit(

        "propertyUpdated",

        {

          propertyId:
            property._id,

          status:
            property.status,

          businessStatus:
            property.businessStatus,

          underNegotiation:
            property.underNegotiation,

          property,

        }
      );
    }
  };

// ======================================================
// ======================================================
// ================= VERIFICATION BOARDS ================
// ======================================================
// ======================================================

// ======================================================
// ================= PENDING BOARD ======================
// ======================================================

router.get(

  "/properties/pending",

  getPendingProperties
);

// ======================================================
// ================= APPROVED BOARD =====================
// ======================================================

router.get(

  "/properties/approved",

  getApprovedProperties
);

// ======================================================
// ================= REJECTED BOARD =====================
// ======================================================

router.get(

  "/properties/rejected",

  getRejectedProperties
);

// ======================================================
// ================= DELETED BOARD ======================
// ======================================================

router.get(

  "/properties/deleted",

  getDeletedProperties
);

// ======================================================
// ======================================================
// ================= DASHBOARD ANALYTICS ================
// ======================================================
// ======================================================

router.get(

  "/properties/stats",

  getAdminPropertyStats
);

// ======================================================
// ================= ADMIN DASHBOARD STATS ==============
// ======================================================

router.get(

  "/stats",

  getAdminStats
);

// ======================================================
// ======================================================
// ================= PROPERTY REVIEW ====================
// ======================================================
// ======================================================

router.get(

  "/property/:id",

  getSinglePropertyAdmin
);

// ======================================================
// ======================================================
// ================= MODERATION SYSTEM ==================
// ======================================================
// ======================================================

// ======================================================
// ================= UNIVERSAL STATUS UPDATE ============
// ======================================================

router.patch(

  "/property/:id/status",

  updatePropertyStatus
);

// ======================================================
// ======================================================
// ================= BUSINESS STATUS SYSTEM =============
// ======================================================
// ======================================================

router.put(

  "/property/:id/business-status",

  async (req, res) => {

    try {

      const {
        id
      } = req.params;

      const {

        businessStatus,

        underNegotiation,

      } = req.body;

      // ======================================================
      // ================= VALIDATE ID ========================
      // ======================================================

      if (
        !isValidId(id)
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid Property ID",

        });
      }

      // ======================================================
      // ================= FIND PROPERTY ======================
      // ======================================================

      const property =
        await Property.findById(
          id
        );

      if (!property) {

        return res.status(404).json({

          success: false,

          message:
            "Property not found",

        });
      }

      // ======================================================
      // ================= BUSINESS STATUS ====================
      // ======================================================

      if (
        businessStatus
      ) {

        property.businessStatus =
          businessStatus;
      }

      // ======================================================
      // ================= NEGOTIATION ========================
      // ======================================================

      if (

        typeof underNegotiation ===
        "boolean"

      ) {

        property.underNegotiation =
          underNegotiation;
      }

      // ======================================================
      // ================= SAVE ===============================
      // ======================================================

      await property.save();

      emitRealtimeUpdate(

        req,

        property
      );

      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        message:
          "Business status updated successfully",

        property,

      });

    } catch (error) {

      console.log(

        "Business Status Error ❌",

        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });
    }
  }
);

// ======================================================
// ======================================================
// ================= IMAGE VERIFICATION =================
// ======================================================
// ======================================================

// ======================================================
// ================= GET PENDING IMAGES =================
// ======================================================

router.get(

  "/images/pending",

  async (req, res) => {

    try {

      const properties =
        await Property.find({

          "images.status":
            "pending",

        })

          .populate(

            "createdBy",

            "name email role uniqueUserId"
          )

          .sort({

            createdAt: -1,

          });

      res.status(200).json({

        success: true,

        total:
          properties.length,

        properties,

      });

    } catch (error) {

      console.log(

        "Pending Images Error ❌",

        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });
    }
  }
);

// ======================================================
// ================= UPDATE IMAGE STATUS ================
// ======================================================

router.patch(

  "/image/:propertyId/:imageId/status",

  updateImageStatus

);

// ======================================================
// ================= APPROVE IMAGE ======================
// ======================================================

router.put(

  "/image/:propertyId/:imageId/approve",

  async (req, res) => {

    try {

      const {

        propertyId,

        imageId,

      } = req.params;

      // ======================================================
      // ================= VALIDATE ID ========================
      // ======================================================

      if (
        !isValidId(
          propertyId
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid Property ID",

        });
      }

      // ======================================================
      // ================= FIND PROPERTY ======================
      // ======================================================

      const property =
        await Property.findById(
          propertyId
        );

      if (!property) {

        return res.status(404).json({

          success: false,

          message:
            "Property not found",

        });
      }

      // ======================================================
      // ================= FIND IMAGE =========================
      // ======================================================

      const image =
        property.images.id(
          imageId
        );

      if (!image) {

        return res.status(404).json({

          success: false,

          message:
            "Image not found",

        });
      }

      // ======================================================
      // ================= UPDATE IMAGE =======================
      // ======================================================

      image.status =
        "approved";

      image.verifiedBy =
        req.user._id;

      image.verifiedAt =
        new Date();

      // ======================================================
      // ================= SAVE ===============================
      // ======================================================

      await property.save();

      emitRealtimeUpdate(

        req,

        property
      );

      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        message:
          "Image approved successfully",

        property,

      });

    } catch (error) {

      console.log(

        "Approve Image Error ❌",

        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });
    }
  }
);

// ======================================================
// ================= REJECT IMAGE =======================
// ======================================================

router.put(

  "/image/:propertyId/:imageId/reject",

  async (req, res) => {

    try {

      const {

        propertyId,

        imageId,

      } = req.params;

      if (
        !isValidId(
          propertyId
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid Property ID",

        });
      }

      const property =
        await Property.findById(
          propertyId
        );

      if (!property) {

        return res.status(404).json({

          success: false,

          message:
            "Property not found",

        });
      }

      const image =
        property.images.id(
          imageId
        );

      if (!image) {

        return res.status(404).json({

          success: false,

          message:
            "Image not found",

        });
      }

      // ======================================================
      // ================= UPDATE IMAGE =======================
      // ======================================================

      image.status =
        "rejected";

      image.verifiedBy =
        req.user._id;

      image.verifiedAt =
        new Date();

      // ======================================================
      // ================= SAVE ===============================
      // ======================================================

      await property.save();

      emitRealtimeUpdate(

        req,

        property
      );

      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        message:
          "Image rejected successfully",

        property,

      });

    } catch (error) {

      console.log(

        "Reject Image Error ❌",

        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });
    }
  }
);

// ======================================================
// ================= DELETE IMAGE =======================
// ======================================================

router.put(

  "/image/:propertyId/:imageId/delete",

  async (req, res) => {

    try {

      const {

        propertyId,

        imageId,

      } = req.params;

      if (
        !isValidId(
          propertyId
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid Property ID",

        });
      }

      const property =
        await Property.findById(
          propertyId
        );

      if (!property) {

        return res.status(404).json({

          success: false,

          message:
            "Property not found",

        });
      }

      const image =
        property.images.id(
          imageId
        );

      if (!image) {

        return res.status(404).json({

          success: false,

          message:
            "Image not found",

        });
      }

      // ======================================================
      // ================= UPDATE IMAGE =======================
      // ======================================================

      image.status =
        "deleted";

      image.verifiedBy =
        req.user._id;

      image.verifiedAt =
        new Date();

      // ======================================================
      // ================= SAVE ===============================
      // ======================================================

      await property.save();

      emitRealtimeUpdate(

        req,

        property
      );

      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        message:
          "Image deleted successfully",

        property,

      });

    } catch (error) {

      console.log(

        "Delete Image Error ❌",

        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });
    }
  }
);



// ======================================================
// ======================================================
// ================= ALL PROPERTIES =====================
// ======================================================
// ======================================================

router.get(

  "/properties/all",

  async (req, res) => {

    try {

      const properties =
        await Property.find()

          .populate(

            "createdBy",

            "name email role uniqueUserId"
          )

          .sort({

            createdAt: -1,

          });

      res.status(200).json({

        success: true,

        total:
          properties.length,

        properties,

      });

    } catch (error) {

      console.log(

        "All Properties Error ❌",

        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });
    }
  }
);

// ======================================================
// ======================================================
// ================= LEADS DASHBOARD ====================
// ======================================================
// ======================================================

router.get(

  "/leads/all",

  async (req, res) => {

    try {

      const leads =
        await Lead.find()

          .sort({

            createdAt: -1,

          });

      res.status(200).json({

        success: true,

        total:
          leads.length,

        leads,

      });

    } catch (error) {

      console.log(

        "Leads Error ❌",

        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",

      });
    }
  }
);

// ======================================================
// ================= EXPORT =============================
// ======================================================

module.exports =
  router;