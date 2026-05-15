const express = require("express");

const router =
  express.Router();

const mongoose =
  require("mongoose");

const Property =
  require("../models/Property");

const User =
  require("../models/User");

const upload =
  require("../middleware/upload");

const {
  protect,
  authorizeRoles,
} = require(
  "../middleware/authMiddleware"
);

// ======================================================
// ================= HELPERS ============================
// ======================================================

// ================= VALIDATE OBJECT ID =================
const isValidId = (
  id
) =>
  mongoose.Types.ObjectId.isValid(
    id
  );

// ================= REALTIME EMIT ======================
const emitRealtimeUpdate = (
  req,
  property
) => {

  const io =
    req.app.get("io");

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
// ================= APPROVED IMAGES ====================
// ======================================================

const getApprovedImages =
  (property) =>
    (
      property.images ||
      []
    ).filter(
      (image) =>
        image.status ===
        "approved"
    );

// ======================================================
// ================= MAP PROPERTY =======================
// ======================================================

const mapApprovedImages =
  (property) => {

    const doc =
      property.toObject
        ? property.toObject()
        : property;

    const approvedImages =
      getApprovedImages(
        doc
      );

    return {
      ...doc,

      // ================= PRIMARY IMAGE =================
      image:
        approvedImages[0]
          ?.url ||
        doc.image ||
        null,

      // ================= GALLERY =================
      images:
        approvedImages,
    };
  };

// ======================================================
// ================= ADD PROPERTY =======================
// ======================================================

router.post(
  "/add",

  protect,

  authorizeRoles(
    "seller",
    "builder",
    "admin"
  ),

  // ✅ MULTI IMAGE SUPPORT
  upload.array(
    "images",
    15
  ),

  async (req, res) => {

    try {

      const isAdmin =
        req.user.role ===
        "admin";

      // ======================================================
      // ================= MULTI IMAGE FORMAT =================
      // ======================================================

      const uploadedImages =
        req.files || [];

      const images =
        uploadedImages.map(
          (file) => ({
            filename:
              file.filename,

            url:
              file.path,

            uploadedBy:
              req.user._id,

            status:
              // ✅ AUTO APPROVE FOR NOW
              "approved",

            verifiedBy:
              isAdmin
                ? req.user._id
                : null,

            verifiedAt:
              isAdmin
                ? new Date()
                : null,
          })
        );

      // ======================================================
      // ================= PRIMARY IMAGE ======================
      // ======================================================

      const primaryImage =
        images[0]?.url ||
        null;

      // ======================================================
      // ================= CREATE PROPERTY ====================
      // ======================================================

      const property =
        new Property({
          title:
            req.body.title,

          price:
            req.body.price,

          location:
            req.body.location,

          type:
            req.body.type,

          subType:
            req.body.subType,

          constructionStatus:
            req.body
              .constructionStatus,

          description:
            req.body
              .description,

          // ================= PRIMARY IMAGE =================
          image:
            primaryImage,

          // ================= GALLERY =======================
          images,

          // ================= STATUS ========================
          status:
            isAdmin
              ? "approved"
              : "pending",

          createdBy:
            req.user._id,

          createdByRole:
            req.user.role,

          ownerUniqueId:
            req.user
              .uniqueUserId ||
            "",

          ownerName:
            req.user.name ||
            "",

          verifiedBy:
            isAdmin
              ? req.user._id
              : null,

          verifiedAt:
            isAdmin
              ? new Date()
              : null,

          lastStatusChangedAt:
            new Date(),

          statusHistory: [
            {
              status:
                isAdmin
                  ? "approved"
                  : "pending",

              changedAt:
                new Date(),

              changedBy:
                isAdmin
                  ? req.user._id
                  : null,
            },
          ],
        });

      await property.save();

      emitRealtimeUpdate(
        req,
        property
      );

      res.status(201).json({
        success: true,

        message:
          isAdmin
            ? "Property published instantly 🚀"
            : "Property submitted for review",

        property:
          mapApprovedImages(
            property
          ),
      });

    } catch (error) {

      console.log(
        "ADD PROPERTY ERROR:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          error.message ||
          "Server error",
      });
    }
  }
);

// ======================================================
// ================= GET APPROVED =======================
// ======================================================

router.get(
  "/approved",

  async (req, res) => {

    try {

      const {
        search,
        type,
        subType,
        minPrice,
        maxPrice,
        location,
        businessStatus,
        sort,
      } = req.query;

      // ======================================================
      // ================= BASE QUERY =========================
      // ======================================================

      const query = {
        status:
          "approved",
      };

      // ======================================================
      // ================= SEARCH =============================
      // ======================================================

      if (search) {

        query.$or = [
          {
            title: {
              $regex:
                search,

              $options:
                "i",
            },
          },

          {
            location: {
              $regex:
                search,

              $options:
                "i",
            },
          },

          {
            propertyUniqueId:
              {
                $regex:
                  search,

                $options:
                  "i",
              },
          },
        ];
      }

      // ======================================================
      // ================= FILTERS ============================
      // ======================================================

      if (type) {

        query.type = {
          $regex: type,
          $options: "i",
        };
      }

      if (subType) {

        query.subType = {
          $regex:
            subType,

          $options:
            "i",
        };
      }

      if (location) {

        query.location = {
          $regex:
            location,

          $options:
            "i",
        };
      }

      if (
        businessStatus
      ) {

        query.businessStatus =
          businessStatus;
      }

      // ======================================================
      // ================= PRICE ==============================
      // ======================================================

      if (
        minPrice ||
        maxPrice
      ) {

        query.price = {};

        if (minPrice) {

          query.price.$gte =
            Number(
              minPrice
            );
        }

        if (maxPrice) {

          query.price.$lte =
            Number(
              maxPrice
            );
        }
      }

      // ======================================================
      // ================= SORT ===============================
      // ======================================================

      let sortOption = {
        createdAt: -1,
      };

      if (
        sort ===
        "price-low-high"
      ) {

        sortOption = {
          price: 1,
        };
      }

      if (
        sort ===
        "price-high-low"
      ) {

        sortOption = {
          price: -1,
        };
      }

      // ======================================================
      // ================= FETCH ==============================
      // ======================================================

      const properties =
        await Property.find(
          query
        )

          .populate(
            "createdBy",
            "name role email uniqueUserId"
          )

          .sort(
            sortOption
          );

      const updated =
        properties.map(
          mapApprovedImages
        );

      res.json(updated);

    } catch (err) {

      console.log(
        "GET APPROVED ERROR:",
        err
      );

      res.status(500).json({
        success: false,

        message:
          "Server error",
      });
    }
  }
);

// ======================================================
// ================= MY PROPERTIES ======================
// ======================================================

router.get(
  "/my-properties",

  protect,

  authorizeRoles(
    "seller",
    "builder",
    "agent",
    "admin"
  ),

  async (req, res) => {

    try {

      const properties =
        await Property.find({
          createdBy:
            req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.json(
        properties.map(
          mapApprovedImages
        )
      );

    } catch (error) {

      console.log(
        "MY PROPERTIES ERROR:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          "Server error",
      });
    }
  }
);

// ======================================================
// ================= DASHBOARD STATS ====================
// ======================================================

router.get(
  "/my-dashboard-stats",

  protect,

  authorizeRoles(
    "seller",
    "builder",
    "agent",
    "admin"
  ),

  async (req, res) => {

    try {

      const ownerQuery = {
        createdBy:
          req.user._id,
      };

      const totalProperties =
        await Property.countDocuments(
          ownerQuery
        );

      const approvedProperties =
        await Property.countDocuments(
          {
            ...ownerQuery,
            status:
              "approved",
          }
        );

      const pendingProperties =
        await Property.countDocuments(
          {
            ...ownerQuery,
            status:
              "pending",
          }
        );

      const rejectedProperties =
        await Property.countDocuments(
          {
            ...ownerQuery,
            status:
              "rejected",
          }
        );

      const soldProperties =
        await Property.countDocuments(
          {
            ...ownerQuery,
            businessStatus:
              "sold",
          }
        );

      const availableProperties =
        await Property.countDocuments(
          {
            ...ownerQuery,
            businessStatus:
              "available",
          }
        );

      const underNegotiationProperties =
        await Property.countDocuments(
          {
            ...ownerQuery,
            underNegotiation:
              true,
          }
        );

      const totalViewsData =
        await Property.aggregate(
          [
            {
              $match:
                ownerQuery,
            },

            {
              $group: {
                _id: null,

                totalViews:
                  {
                    $sum:
                      "$totalViews",
                  },
              },
            },
          ]
        );

      const totalViews =
        totalViewsData[0]
          ?.totalViews || 0;

      const totalInquiryData =
        await Property.aggregate(
          [
            {
              $match:
                ownerQuery,
            },

            {
              $group: {
                _id: null,

                totalInquiries:
                  {
                    $sum:
                      "$totalInquiries",
                  },
              },
            },
          ]
        );

      const totalInquiries =
        totalInquiryData[0]
          ?.totalInquiries ||
        0;

      res.json({
        totalProperties,

        approvedProperties,

        pendingProperties,

        rejectedProperties,

        soldProperties,

        availableProperties,

        underNegotiationProperties,

        totalViews,

        totalInquiries,
      });

    } catch (error) {

      console.log(
        "DASHBOARD STATS ERROR:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          "Server error",
      });
    }
  }
);

// ======================================================
// ================= SINGLE PROPERTY ====================
// ======================================================

router.get(
  "/:id",

  async (req, res) => {

    try {

      const { id } =
        req.params;

      if (
        !isValidId(id)
      ) {

        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid property ID",
          });
      }

      const property =
        await Property.findById(
          id
        ).populate(
          "createdBy",
          "name role email uniqueUserId"
        );

      if (!property) {

        return res
          .status(404)
          .json({
            success: false,

            message:
              "Property not found",
          });
      }

      // ================= TRACK VIEWS =================
      property.totalViews += 1;

      await property.save();

      res.json(
        mapApprovedImages(
          property
        )
      );

    } catch (error) {

      console.log(
        "GET PROPERTY ERROR:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          "Server error",
      });
    }
  }
);

// ======================================================
// ================= DELETE PROPERTY ====================
// ======================================================

router.delete(
  "/:id",

  protect,

  async (req, res) => {

    try {

      const property =
        await Property.findById(
          req.params.id
        );

      if (!property) {

        return res
          .status(404)
          .json({
            success: false,

            message:
              "Property not found",
          });
      }

      const isOwner =
        property.createdBy.toString() ===
        req.user._id.toString();

      const isAdmin =
        req.user.role ===
        "admin";

      if (
        !isOwner &&
        !isAdmin
      ) {

        return res
          .status(403)
          .json({
            success: false,

            message:
              "Access denied",
          });
      }

      await Property.findByIdAndDelete(
        req.params.id
      );

      emitRealtimeUpdate(
        req,
        property
      );

      res.json({
        success: true,

        message:
          "Property deleted successfully",
      });

    } catch (error) {

      console.log(
        "DELETE PROPERTY ERROR:",
        error
      );

      res.status(500).json({
        success: false,

        message:
          "Server error",
      });
    }
  }
);

module.exports =
  router;