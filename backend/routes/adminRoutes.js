const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Property = require("../models/Property");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");


// ================= HELPER: VALIDATE ID =================
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const syncPrimaryApprovedImage = (property) => {
  const approvedImage = (property.images || []).find(
    (image) => image.status === "approved"
  );

  property.image = approvedImage ? approvedImage.filename : null;
};


// ================= GET PENDING PROPERTIES =================
router.get(
  "/properties/pending",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const properties = await Property.find({ status: "pending" })
        .populate("createdBy", "name role")
        .sort({ createdAt: -1 });

      res.json(properties);

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// ================= GET PENDING IMAGES =================
router.get(
  "/properties/pending-images",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const properties = await Property.find({
        "images.status": "pending",
      })
        .populate("createdBy", "name role")
        .sort({ createdAt: -1 });

      res.json(
        properties.filter((property) =>
          (property.images || []).some((image) => image.status === "pending")
        )
      );

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// ================= APPROVE PROPERTY =================
router.put(
  "/property/:id/approve",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const property = await Property.findByIdAndUpdate(
        id,
        { status: "approved" },
        { new: true }
      );

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json({
        message: "Property approved",
        property,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// ================= APPROVE PROPERTY IMAGE =================
router.put(
  "/property/:propertyId/image/:imageId/approve",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { propertyId, imageId } = req.params;

      if (!isValidId(propertyId) || !isValidId(imageId)) {
        return res.status(400).json({ message: "Invalid property or image ID" });
      }

      const property = await Property.findById(propertyId);

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      const image = property.images.id(imageId);

      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      image.status = "approved";
      image.verifiedBy = req.user._id;
      image.verifiedAt = new Date();

      syncPrimaryApprovedImage(property);
      await property.save();

      res.json({
        message: "Image approved",
        property,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// ================= REJECT PROPERTY =================
router.put(
  "/property/:id/reject",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidId(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const property = await Property.findByIdAndUpdate(
        id,
        { status: "rejected" },
        { new: true }
      );

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json({
        message: "Property rejected",
        property,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// ================= REJECT PROPERTY IMAGE =================
router.put(
  "/property/:propertyId/image/:imageId/reject",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { propertyId, imageId } = req.params;

      if (!isValidId(propertyId) || !isValidId(imageId)) {
        return res.status(400).json({ message: "Invalid property or image ID" });
      }

      const property = await Property.findById(propertyId);

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      const image = property.images.id(imageId);

      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      image.status = "rejected";
      image.verifiedBy = req.user._id;
      image.verifiedAt = new Date();

      syncPrimaryApprovedImage(property);
      await property.save();

      res.json({
        message: "Image rejected",
        property,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// ================= GET APPROVED PROPERTIES =================
router.get(
  "/properties/approved",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const properties = await Property.find({ status: "approved" })
        .populate("createdBy", "name role")
        .sort({ createdAt: -1 });

      res.json(properties);

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


module.exports = router;
