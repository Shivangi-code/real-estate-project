const Property = require("../models/Property");

// ======================================================
// ================= HELPER FUNCTIONS ====================
// ======================================================

// ================= ESCAPE REGEX =======================

const escapeRegex = (text = "") => {
  return text.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};

// ================= PRICE CONVERTER ====================

const convertPrice = (
  price,
  priceUnit
) => {
  let finalPrice =
    Number(price) || 0;

  if (priceUnit === "lac") {
    finalPrice =
      finalPrice * 100000;
  }

  if (priceUnit === "cr") {
    finalPrice =
      finalPrice * 10000000;
  }

  return finalPrice;
};

// ======================================================
// ================= ADD PROPERTY =======================
// ======================================================

exports.addProperty =
  async (req, res) => {
    try {

      // ======================================================
      // ================= USER ===============================
      // ======================================================

      const user =
        req.user;

      const isAdmin =
        user?.role ===
        "admin";

      // ======================================================
      // ================= STATUS =============================
      // ======================================================

      const propertyStatus =
        isAdmin
          ? "approved"
          : "pending";

      const imageStatus =
        isAdmin
          ? "approved"
          : "pending";

      // ======================================================
      // ================= FILES ==============================
      // ======================================================

      const uploadedFiles =
        Array.isArray(req.files)
          ? req.files
          : [];

      // ======================================================
      // ================= IMAGES =============================
      // ======================================================

      const images =
        uploadedFiles.map(
          (file) => ({

            filename:
              file.filename || "",

            url:
              file.path || "",

            uploadedBy:
              user.id,

            status:
              imageStatus,

            approvedAt:
              isAdmin
                ? new Date()
                : null,

            approvedBy:
              isAdmin
                ? user.id
                : null,
          })
        );

      // ======================================================
      // ================= MAIN IMAGE =========================
      // ======================================================

      const imageUrl =
        images?.[0]?.url ||
        "";

      // ======================================================
      // ================= PRICE ==============================
      // ======================================================

      const finalPrice =
        convertPrice(
          req.body.price,
          req.body.priceUnit
        );

      // ======================================================
      // ================= VERIFICATION =======================
      // ======================================================

      const initialVerificationLog = {

        previousStatus: "",

        newStatus:
          propertyStatus,

        actionBy:
          user.id,

        actionByName:
          user.name || "",

        note:
          isAdmin

            ? "Property auto-approved by admin"

            : "Property submitted for verification",

        timestamp:
          new Date(),
      };

      // ======================================================
      // ================= CREATE =============================
      // ======================================================

      const property =
        await Property.create({

          // ================= BASIC =================

          title:
            req.body.title || "",

          description:
            req.body.description || "",

          // ================= PRICE =================

          price:
            finalPrice,

          priceUnit:
            req.body.priceUnit || "lac",

          // ================= AREA ==================

          area:
            Number(
              req.body.area
            ) || 0,

          areaUnit:
            req.body.areaUnit ||
            "sqft",

          // ================= LOCATION ==============

          location:
            req.body.location || "",

          // ================= CATEGORY ==============

          type:
            req.body.type || "",

          subType:
            req.body.subType || "",

          // ================= CONSTRUCTION ==========

          constructionStatus:
            req.body
              .constructionStatus || "",

          // ================= BUSINESS STATUS =======

          businessStatus:
            "available",

          underNegotiation:
            false,

          // ================= MODERATION ============

          status:
            propertyStatus,

          approvedAt:
            isAdmin
              ? new Date()
              : null,

          approvedBy:
            isAdmin
              ? user.id
              : null,

          lastModeratedAt:
            new Date(),

          lastModeratedBy:
            user.id,

          moderationNote:
            isAdmin

              ? "Auto approved by admin"

              : "Waiting for admin verification",

          verificationLogs: [
            initialVerificationLog,
          ],

          // ================= IMAGES =================

          image:
            imageUrl,

          images,

          // ================= OWNER ==================

          createdBy:
            user.id,

          createdByRole:
            user.role || "",

          ownerUniqueId:
            user.userUniqueId || "",

          ownerName:
            user.name || "",
        });

      // ======================================================
      // ================= SOCKET =============================
      // ======================================================

      const io =
        req.app.get("io");

      if (io) {

        io.emit(
          "propertyAdded",
          property
        );
      }

      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(201).json({

        success: true,

        message:
          isAdmin

            ? "Property added & auto-approved successfully 🚀"

            : "Property submitted for verification ⏳",

        property,
      });

    } catch (error) {

      console.log(
        "Add Property Error ❌",
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
// ================= GET FILTERED PROPERTIES ============
// ======================================================

exports.getFilteredProperties =
  async (req, res) => {

    try {

      const {

        search,

        type,

        subType,

        maxPrice,

      } = req.query;

      // ======================================================
      // ================= FILTERS ============================
      // ======================================================

      const andFilters = [];

      // ======================================================
      // ================= APPROVED ONLY ======================
      // ======================================================

      andFilters.push({

        status:
          "approved",
      });

      // ======================================================
      // ================= SEARCH =============================
      // ======================================================

      if (
        search &&
        search.trim() !== ""
      ) {

        const escapedSearch =
          escapeRegex(search);

        andFilters.push({

          $or: [

            {
              title: {
                $regex:
                  escapedSearch,
                $options: "i",
              },
            },

            {
              location: {
                $regex:
                  escapedSearch,
                $options: "i",
              },
            },

            {
              description: {
                $regex:
                  escapedSearch,
                $options: "i",
              },
            },

            {
              type: {
                $regex:
                  escapedSearch,
                $options: "i",
              },
            },

            {
              subType: {
                $regex:
                  escapedSearch,
                $options: "i",
              },
            },
          ],
        });
      }

      // ======================================================
      // ================= TYPE ===============================
      // ======================================================

      if (
        type &&
        type.trim() !== ""
      ) {

        andFilters.push({

          type: {
            $regex:
              escapeRegex(type),
            $options: "i",
          },
        });
      }

      // ======================================================
      // ================= SUBTYPE ============================
      // ======================================================

      if (
        subType &&
        subType.trim() !== ""
      ) {

        andFilters.push({

          subType: {
            $regex:
              escapeRegex(subType),
            $options: "i",
          },
        });
      }

      // ======================================================
      // ================= MAX PRICE ==========================
      // ======================================================

      if (
        maxPrice &&
        !isNaN(maxPrice)
      ) {

        andFilters.push({

          price: {
            $lte:
              Number(maxPrice),
          },
        });
      }

      // ======================================================
      // ================= FINAL FILTER =======================
      // ======================================================

      const finalFilter =

        andFilters.length > 0

          ? {
              $and:
                andFilters,
            }

          : {};

      // ======================================================
      // ================= GET ================================
      // ======================================================

      const properties =
        await Property.find(
          finalFilter
        )

          .sort({

            createdAt: -1,
          })

          .lean();

      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        count:
          properties.length,

        properties,
      });

    } catch (err) {

      console.log(
        "Property Filter Error ❌",
        err
      );

      res.status(500).json({

        success: false,

        message:
          "Server error",
      });
    }
  };

// ======================================================
// ================= GET MY PROPERTIES ==================
// ======================================================

exports.getMyProperties =
  async (req, res) => {

    try {

      const properties =
        await Property.find({

          createdBy:
            req.user.id,

          status: {
            $ne: "deleted",
          },

        })
          .sort({

            createdAt: -1,
          })

          .lean();

      // ======================================================
      // ================= COUNTS =============================
      // ======================================================

      const counts = {

        total:
          properties.length,

        pending:
          properties.filter(
            (p) =>
              p.status ===
              "pending"
          ).length,

        approved:
          properties.filter(
            (p) =>
              p.status ===
              "approved"
          ).length,

        rejected:
          properties.filter(
            (p) =>
              p.status ===
              "rejected"
          ).length,

        deleted:
          properties.filter(
            (p) =>
              p.status ===
              "deleted"
          ).length,
      };

      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        properties,

        counts,
      });

    } catch (error) {

      console.log(
        "Get My Properties Error ❌",
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
// ================= GET SINGLE PROPERTY ================
// ======================================================

exports.getSingleProperty =
  async (req, res) => {

    try {

      const propertyId =
        req.params.id;

      if (!propertyId) {

        return res.status(400).json({

          success: false,

          message:
            "Property ID is required",
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

      const user =
        req.user || null;

      const isOwner =

        user &&

        property.createdBy
          ?.toString() ===
        user.id;

      const isAdmin =

        user &&

        user.role ===
        "admin";

      // ======================================================
      // ================= ACCESS CONTROL =====================
      // ======================================================

      if (

        property.status ===
          "deleted" &&

        !isOwner &&

        !isAdmin

      ) {

        return res.status(404).json({

          success: false,

          message:
            "Property not found",
        });
      }

      if (

        property.status ===
          "rejected" &&

        !isOwner &&

        !isAdmin

      ) {

        return res.status(403).json({

          success: false,

          message:
            "This property is not publicly available",
        });
      }

      if (

        property.status ===
          "pending" &&

        !isOwner &&

        !isAdmin

      ) {

        return res.status(403).json({

          success: false,

          message:
            "This property is under verification",
        });
      }

      // ======================================================
      // ================= VIEW TRACKING ======================
      // ======================================================

      const shouldTrackView =

        property.status ===
        "approved";

      if (shouldTrackView) {

        property.totalViews =

          (property.totalViews || 0) + 1;

        await property.save();
      }

      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        property,
      });

    } catch (error) {

      console.log(
        "Get Single Property Error ❌",
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
// ================= UPDATE PROPERTY ====================
// ======================================================

exports.updateProperty =
  async (req, res) => {

    try {

      const propertyId =
        req.params.id;

      const user =
        req.user;

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
      // ================= ACCESS =============================
      // ======================================================

      

      const isAdmin =
        user.role ===
        "admin";

      if (!isAdmin ) {

        return res.status(403).json({

          success: false,

          message:
            "Access denied",
        });
      }

      // ======================================================
      // ================= STATUS =============================
      // ======================================================

      const previousStatus =
        property.status;

      let updatedStatus =
        previousStatus;

      if (!isAdmin) {

        updatedStatus =
          "pending";
      }

      // ======================================================
      // ================= PRICE ==============================
      // ======================================================

      const finalPrice =
        convertPrice(
          req.body.price,
          req.body.priceUnit
        );

      // ======================================================
      // ================= IMAGES =============================
      // ======================================================

      const uploadedFiles =
        Array.isArray(req.files)
          ? req.files
          : [];

      let updatedImages =
        property.images || [];

      if (
        uploadedFiles.length > 0
      ) {

        updatedImages =
          uploadedFiles.map(
            (file) => ({

              filename:
                file.filename || "",

              url:
                file.path || "",

              uploadedBy:
                user.id,

              status:
                isAdmin
                  ? "approved"
                  : "pending",

              approvedAt:
                isAdmin
                  ? new Date()
                  : null,

              approvedBy:
                isAdmin
                  ? user.id
                  : null,
            })
          );
      }

      // ======================================================
      // ================= UPDATE =============================
      // ======================================================

      property.title =
        req.body.title ||
        property.title;

      property.description =
        req.body.description ||
        property.description;

      property.price =
        finalPrice ||
        property.price;

      property.priceUnit =
        req.body.priceUnit ||
        property.priceUnit;

      property.area =
        Number(req.body.area) ||
        property.area;

      property.areaUnit =
        req.body.areaUnit ||
        property.areaUnit;

      property.location =
        req.body.location ||
        property.location;

      property.type =
        req.body.type ||
        property.type;

      property.subType =
        req.body.subType ||
        property.subType;

      property.constructionStatus =
        req.body
          .constructionStatus ||
        property.constructionStatus;

      property.status =
        updatedStatus;

      property.images =
        updatedImages;

      property.image =
        updatedImages?.[0]?.url ||
        property.image;

      property.updatedAt =
        new Date();

      property.lastModeratedAt =
        new Date();

      property.lastModeratedBy =
        user.id;

      property.moderationNote =
        isAdmin

          ? "Updated by admin"

          : "Property updated and sent for re-verification";

      // ======================================================
      // ================= VERIFICATION LOG ===================
      // ======================================================

      property.verificationLogs.push({

        previousStatus:
          previousStatus,

        newStatus:
          updatedStatus,

        actionBy:
          user.id,

        actionByName:
          user.name || "",

        note:
          isAdmin

            ? "Property updated by admin"

            : "Property updated and sent for verification",

        timestamp:
          new Date(),
      });

      await property.save();

      // ======================================================
      // ================= SOCKET =============================
      // ======================================================

      const io =
        req.app.get("io");

      if (io) {

        io.emit(
          "propertyUpdated",
          property
        );
      }

      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        message:
          "Property updated successfully",

        property,
      });

    } catch (error) {

      console.log(
        "Update Property Error ❌",
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
// ================= DELETE PROPERTY ====================
// ======================================================

exports.deleteProperty =
  async (req, res) => {

    try {

      const propertyId =
        req.params.id;

      const user =
        req.user;

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
      // ================= ACCESS =============================
      // ======================================================

      const isAdmin =
        user.role ===
        "admin";

      if (!isAdmin) {

        return res.status(403).json({

          success: false,

          message:
            "Access denied",
        });
      }

      // ======================================================
      // ================= SOFT DELETE ========================
      // ======================================================

      const previousStatus =
        property.status;

      property.status =
        "deleted";

      property.deletedAt =
        new Date();

      property.deletedBy =
        user.id;

      property.lastModeratedAt =
        new Date();

      property.lastModeratedBy =
        user.id;

      property.moderationNote =
        "Property moved to recycle bin";

      // ======================================================
      // ================= VERIFICATION LOG ===================
      // ======================================================

      property.verificationLogs.push({

        previousStatus:
          previousStatus,

        newStatus:
          "deleted",

        actionBy:
          user.id,

        actionByName:
          user.name || "",

        note:
          "Property deleted",

        timestamp:
          new Date(),
      });

      await property.save();

      // ======================================================
      // ================= SOCKET =============================
      // ======================================================

      const io =
        req.app.get("io");

      if (io) {

        io.emit(
          "propertyDeleted",
          property
        );
      }

      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        message:
          "Property deleted successfully",

        property,
      });

    } catch (error) {

      console.log(
        "Delete Property Error ❌",
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
// ================= RESTORE PROPERTY ===================
// ======================================================

exports.restoreProperty =
  async (req, res) => {

    try {

      const propertyId =
        req.params.id;

      const user =
        req.user;

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
      // ================= ACCESS =============================
      // ======================================================

      const isAdmin =
        user.role ===
        "admin";

      if (!isAdmin) {

        return res.status(403).json({

          success: false,

          message:
            "Access denied",
        });
      }

      // ======================================================
      // ================= RESTORE ============================
      // ======================================================

      const previousStatus =
        property.status;

      property.status =
        "pending";

      property.restoredAt =
        new Date();

      property.restoredBy =
        user.id;

      property.lastModeratedAt =
        new Date();

      property.lastModeratedBy =
        user.id;

      property.moderationNote =
        "Property restored and sent for verification";

      // ======================================================
      // ================= VERIFICATION LOG ===================
      // ======================================================

      property.verificationLogs.push({

        previousStatus:
          previousStatus,

        newStatus:
          "pending",

        actionBy:
          user.id,

        actionByName:
          user.name || "",

        note:
          "Property restored for re-verification",

        timestamp:
          new Date(),
      });

      await property.save();

      // ======================================================
      // ================= SOCKET =============================
      // ======================================================

      const io =
        req.app.get("io");

      if (io) {

        io.emit(
          "propertyRestored",
          property
        );
      }

      // ======================================================
      // ================= RESPONSE ===========================
      // ======================================================

      res.status(200).json({

        success: true,

        message:
          "Property restored successfully",

        property,
      });

    } catch (error) {

      console.log(
        "Restore Property Error ❌",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server Error",
      });
    }
  };