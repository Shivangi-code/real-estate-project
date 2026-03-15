const express = require("express");
const router = express.Router();   // 🔥 define router first

const Property = require("../models/Property");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/authMiddleware");

// ADD PROPERTY
router.post("/add", authMiddleware, upload.single("image"), async (req, res) => {
  try {

    console.log("Logged in user:", req.user);

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
      createdBy: req.user.id,
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
});

// GET APPROVED PROPERTIES (Public)
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

// GET MY PROPERTIES (Seller / Agent / Builder)
router.get("/my-properties", authMiddleware, async (req, res) => {
  try {
    const properties = await Property.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;   