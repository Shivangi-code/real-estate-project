const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Property = require("../models/Property");
const upload = require("../middleware/upload");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// ================= HELPERS =================

// Validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get only approved images
const getApprovedImages = (property) =>
  (property.images || []).filter(
    (image) => image.status === "approved"
  );

// Map approved images
const mapApprovedImages = (property) => {
  const doc = property.toObject
    ? property.toObject()
    : property;

  const approvedImages = getApprovedImages(doc);

  return {
    ...doc,
    image: approvedImages[0]?.url
      ? approvedImages[0].url
      : doc.image || null,
    images: approvedImages,
  };
};

// ================= ADD PROPERTY =================

router.post(
  "/add",
  protect,
  authorizeRoles("seller", "agent", "builder"), // ✅ FIXED
  upload.single("image"),
  async (req, res) => {
    try {
      const images = req.file
        ? [
            {
              filename: req.file.filename,
              url: req.file.path,
              uploadedBy: req.user._id,
              status: "pending",
            },
          ]
        : [];

      const property = new Property({
        title: req.body.title,
        price: req.body.price,
        location: req.body.location,
        type: req.body.type,
        subType: req.body.subType,
        constructionStatus:
          req.body.constructionStatus,
        description: req.body.description,

        image: req.file ? req.file.path : null,

        images,
        status: "pending",
        createdBy: req.user._id,
      });

      await property.save();

      res.status(201).json({
        message: "Property added successfully",
        property,
      });
    } catch (error) {
      console.log("ADD PROPERTY ERROR:", error);
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ================= GET APPROVED =================

router.get("/approved", async (req, res) => {
  try {
    const properties = await Property.find({
      status: "approved",
    })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    const updated =
      properties.map(mapApprovedImages);

    res.json(updated);
  } catch (err) {
    console.log("GET APPROVED ERROR:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// ================= MY PROPERTIES =================

router.get(
  "/my-properties",
  protect,
  async (req, res) => {
    try {
      const properties =
        await Property.find({
          createdBy: req.user._id,
        }).sort({ createdAt: -1 });

      const updated =
        properties.map(mapApprovedImages);

      res.json(updated);
    } catch (err) {
      console.log("MY PROPERTIES ERROR:", err);
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

module.exports = router;