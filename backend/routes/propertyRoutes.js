const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Property = require("../models/Property");
const upload = require("../middleware/upload");

// ✅ FIXED IMPORT
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const getApprovedImages = (property) =>
  (property.images || []).filter((image) => image.status === "approved");

const mapApprovedImages = (property) => {
  const doc = property.toObject ? property.toObject() : property;
  const approvedImages = getApprovedImages(doc);

  return {
    ...doc,
    image: approvedImages[0]?.filename || doc.image || null,
    images: approvedImages,
  };
};


// ================= ADD PROPERTY =================
// Only seller can add
router.post(
  "/add",
  protect,
  authorizeRoles("seller"),
  upload.single("image"),
  async (req, res) => {
    try {
      const images = req.file
        ? [
            {
              filename: req.file.filename,
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
        constructionStatus: req.body.constructionStatus,
        description: req.body.description,
        image: req.file?.filename,
        status: "pending",
        createdBy: req.user._id, // ✅ FIXED (_id instead of id)
      });

      await property.save();

      res.status(201).json({
        message: "Property added successfully",
        property,
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// ================= GET APPROVED (PUBLIC) =================
router.get("/approved", async (req, res) => {
  try {
    const properties = await Property.find({ status: "approved" })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.json(properties);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= MY PROPERTIES =================
router.get("/my-properties", protect, async (req, res) => {
  try {
    const properties = await Property.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    res.json(properties);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
