const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Property = require("../models/Property");
const upload = require("../middleware/upload");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ✅ Get approved images
const getApprovedImages = (property) =>
  (property.images || []).filter((image) => image.status === "approved");

// ✅ Map image properly
const mapApprovedImages = (property) => {
  const doc = property.toObject ? property.toObject() : property;
  const approvedImages = getApprovedImages(doc);

  return {
    ...doc,
    image: approvedImages[0]?.filename
      ? `uploads/${approvedImages[0].filename}`
      : doc.image
      ? `uploads/${doc.image}`
      : null,
    images: approvedImages,
  };
};



// ================= ADD PROPERTY =================
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

        // ✅ FIXED IMAGE PATH
        image: req.file ? `uploads/${req.file.filename}` : null,

        images, // ✅ SAVE IMAGES ARRAY

        status: "pending",
        createdBy: req.user._id,
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



// ================= GET APPROVED =================
router.get("/approved", async (req, res) => {
  try {
    const properties = await Property.find({ status: "approved" })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    // ✅ APPLY IMAGE FIX
    const updated = properties.map(mapApprovedImages);

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



// ================= MY PROPERTIES =================
router.get("/my-properties", protect, async (req, res) => {
  try {
    const properties = await Property.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 });

    const updated = properties.map(mapApprovedImages);

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;