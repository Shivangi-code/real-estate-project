const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Property = require("../models/Property");
const upload = require("../middleware/upload");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// ================= HELPERS =================

// Validate ObjectId
const isValidId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

// ================= SAFE STATUS QUERY =================
const statusQuery = (
  status
) => ({
  $expr: {
    $eq: [
      {
        $toLower: {
          $trim: {
            input: "$status",
          },
        },
      },
      status.toLowerCase(),
    ],
  },
});

// ================= REALTIME EMIT =================
const emitRealtimeUpdate = (
  req,
  property
) => {

  const io = req.app.get("io");

  if (io) {
    io.emit("propertyUpdated", {
      propertyId: property._id,
      status: property.status,
      property,
    });
  }
};

// ================= APPROVED IMAGES =================
const getApprovedImages = (
  property
) =>
  (property.images || []).filter(
    (image) =>
      image.status ===
      "approved"
  );

// ================= MAP APPROVED IMAGES =================
const mapApprovedImages = (
  property
) => {

  const doc =
    property.toObject
      ? property.toObject()
      : property;

  const approvedImages =
    getApprovedImages(doc);

  return {
    ...doc,

    image:
      approvedImages[0]?.url
        ? approvedImages[0]
            .url
        : doc.image || null,

    images: approvedImages,
  };
};

// ================= ADD PROPERTY =================

router.post(
  "/add",
  protect,

  authorizeRoles(
    "seller",
    "builder",
    "admin"
  ),

  upload.single("image"),

  async (req, res) => {

    try {

      const isAdmin =
        req.user.role ===
        "admin";

      const images =
        req.file
          ? [
              {
                filename:
                  req.file
                    .filename,

                url: req.file
                  .path,

                uploadedBy:
                  req.user
                    ._id,

                status:
                  isAdmin
                    ? "approved"
                    : "pending",

                verifiedBy:
                  isAdmin
                    ? req.user
                        ._id
                    : null,

                verifiedAt:
                  isAdmin
                    ? new Date()
                    : null,
              },
            ]
          : [];

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

          image:
            req.file
              ? req.file
                  .path
              : null,

          images,

          status: isAdmin
            ? "approved"
                .trim()
                .toLowerCase()
            : "pending"
                .trim()
                .toLowerCase(),

          createdBy:
            req.user._id,

          createdByRole:
            req.user.role,

          verifiedBy:
            isAdmin
              ? req.user
                  ._id
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
                  ? req.user
                      ._id
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

        property,
      });

    } catch (error) {

      console.log(
        "ADD PROPERTY ERROR:",
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

// ================= GET APPROVED + FILTERS =================

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
      } = req.query;

      // ================= BASE QUERY =================
      const query = {
        $expr: {
          $eq: [
            {
              $toLower: {
                $trim: {
                  input: "$status",
                },
              },
            },
            "approved",
          ],
        },
      };

      // ================= SEARCH =================
      if (search) {

        query.$or = [

          {
            title: {
              $regex: search,
              $options: "i",
            },
          },

          {
            location: {
              $regex: search,
              $options: "i",
            },
          },
        ];
      }

      // ================= TYPE =================
      if (type) {

        query.type = {
          $regex: type,
          $options: "i",
        };
      }

      // ================= SUBTYPE =================
      if (subType) {

        query.subType = {
          $regex: subType,
          $options: "i",
        };
      }

      // ================= LOCATION =================
      if (location) {

        query.location = {
          $regex: location,
          $options: "i",
        };
      }

      // ================= PRICE =================
      if (
        minPrice ||
        maxPrice
      ) {

        query.price = {};

        if (minPrice) {
          query.price.$gte =
            Number(minPrice);
        }

        if (maxPrice) {
          query.price.$lte =
            Number(maxPrice);
        }
      }

      // ================= FETCH =================
      const properties =
        await Property.find(query)
          .populate(
            "createdBy",
            "name role"
          )
          .sort({
            createdAt: -1,
          });

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
        message:
          "Server error",
      });
    }
  }
);

// ================= MY PROPERTIES =================

router.get(
  "/my-properties",

  protect,

  async (req, res) => {

    try {

      const properties =
        await Property.find({
          createdBy:
            req.user._id,
        }).sort({
          createdAt: -1,
        });

      const updated =
        properties.map(
          mapApprovedImages
        );

      res.json(updated);

    } catch (err) {

      console.log(
        "MY PROPERTIES ERROR:",
        err
      );

      res.status(500).json({
        message:
          "Server error",
      });
    }
  }
);

module.exports = router;