const express = require("express");
const router = express.Router();

const Lead = require("../models/Lead");

// ================= CREATE LEAD =================
router.post("/create", async (req, res) => {
  try {
    const {
      propertyId,
      propertyTitle,
      buyerName,
      buyerEmail,
      buyerMobile,
      message,
    } = req.body;

    if (
      !propertyId ||
      !propertyTitle ||
      !buyerName ||
      !buyerMobile
    ) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const lead = await Lead.create({
      propertyId,
      propertyTitle,
      buyerName,
      buyerEmail,
      buyerMobile,
      message,
    });

    res.status(201).json({
      message: "Inquiry sent successfully",
      lead,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

// ================= GET ALL LEADS =================
router.get("/all", async (req, res) => {
  try {
    const leads = await Lead.find()
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch {
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;