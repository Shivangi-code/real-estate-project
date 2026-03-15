const express = require("express");
const router = express.Router();
const Property = require("../models/Property");
const authMiddleware = require("../middleware/authMiddleware");

// ADMIN AUTH CHECK
const checkAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

// GET PENDING PROPERTIES
router.get("/properties/pending", authMiddleware, checkAdmin, async (req, res) => {
  try {
    const properties = await Property.find({ status: "pending" })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// APPROVE PROPERTY
router.put("/property/:id/approve", authMiddleware, checkAdmin, async (req, res) => {
  try {
    await Property.findByIdAndUpdate(req.params.id, { status: "approved" });
    res.json({ message: "Property approved" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// REJECT PROPERTY
router.put("/property/:id/reject", authMiddleware, checkAdmin, async (req, res) => {
  try {
    await Property.findByIdAndUpdate(req.params.id, { status: "rejected" });
    res.json({ message: "Property rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET APPROVED PROPERTIES
router.get("/properties/approved", authMiddleware, checkAdmin, async (req, res) => {
  try {
    const properties = await Property.find({ status: "approved" })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;