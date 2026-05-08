const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Property = require("../models/Property");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// ================= VALIDATE ID =================
const isValidId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

// ================= CHANGE STATUS (CORE ENGINE) =================
const updatePropertyStatus = async (
  id,
  newStatus,
  adminId
) => {
  const property = await Property.findById(id);

  if (!property) return null;

  property.status = newStatus;
  property.verifiedBy = adminId;
  property.verifiedAt = new Date();
  property.lastStatusChangedAt = new Date();

  property.statusHistory.push({
    status: newStatus,
    changedAt: new Date(),
    changedBy: adminId,
  });

  await property.save();

  return property;
};

// ================= GET ALL =================
router.get(
  "/properties/all",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const properties = await Property.find()
        .populate("createdBy", "name role")
        .populate("verifiedBy", "name")
        .sort({ createdAt: -1 });

      res.json(properties);
    } catch (err) {
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ================= GET PENDING =================
router.get(
  "/properties/pending",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    const data = await Property.find({ status: "pending" })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.json(data);
  }
);

// ================= GET APPROVED =================
router.get(
  "/properties/approved",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    const data = await Property.find({ status: "approved" })
      .populate("createdBy", "name role")
      .populate("verifiedBy", "name")
      .sort({ createdAt: -1 });

    res.json(data);
  }
);

// ================= GET REJECTED =================
router.get(
  "/properties/rejected",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    const data = await Property.find({ status: "rejected" })
      .populate("createdBy", "name role")
      .populate("verifiedBy", "name")
      .sort({ createdAt: -1 });

    res.json(data);
  }
);

// ================= GET DELETED =================
router.get(
  "/properties/deleted",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    const data = await Property.find({ status: "deleted" })
      .populate("createdBy", "name role")
      .populate("verifiedBy", "name")
      .sort({ createdAt: -1 });

    res.json(data);
  }
);

// ================= APPROVE =================
router.put(
  "/property/:id/approve",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      if (!isValidId(req.params.id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const property = await updatePropertyStatus(
        req.params.id,
        "approved",
        req.user._id
      );

      res.json({
        message: "Approved",
        property,
      });
    } catch {
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ================= REJECT =================
router.put(
  "/property/:id/reject",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const property = await updatePropertyStatus(
        req.params.id,
        "rejected",
        req.user._id
      );

      res.json({
        message: "Rejected",
        property,
      });
    } catch {
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ================= BACK TO PENDING =================
router.put(
  "/property/:id/pending",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const property = await updatePropertyStatus(
        req.params.id,
        "pending",
        req.user._id
      );

      res.json({
        message: "Moved to pending",
        property,
      });
    } catch {
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ================= DELETE (ADMIN ONLY) =================
router.put(
  "/property/:id/delete",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const property = await updatePropertyStatus(
        req.params.id,
        "deleted",
        req.user._id
      );

      res.json({
        message: "Property moved to deleted",
        property,
      });
    } catch (err) {
      console.log("DELETE ERROR:", err);
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ================= GENERIC STATUS UPDATE =================
// (future-proof restore system)
router.put(
  "/property/:id/status",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowed = ["pending", "approved", "rejected", "deleted"];

      if (!allowed.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const property = await updatePropertyStatus(
        req.params.id,
        status,
        req.user._id
      );

      res.json({
        message: `Property moved to ${status}`,
        property,
      });
    } catch (err) {
      console.log("STATUS ERROR:", err);
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ================= STATS (DASHBOARD ENGINE) =================
router.get(
  "/stats",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const total = await Property.countDocuments();
      const pending = await Property.countDocuments({ status: "pending" });
      const approved = await Property.countDocuments({ status: "approved" });
      const rejected = await Property.countDocuments({ status: "rejected" });
      const deleted = await Property.countDocuments({ status: "deleted" });

      res.json({
        total,
        pending,
        approved,
        rejected,
        deleted,
      });
    } catch (err) {
      console.log("STATS ERROR:", err);
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

module.exports = router;