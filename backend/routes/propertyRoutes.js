const express = require("express");

const router = express.Router();

const controllerPath = require.resolve("../controllers/propertyController");

const controllers = require("../controllers/propertyController");


// ================= CONTROLLER =================
const {
  addProperty,
  getFilteredProperties,
  getPropertyById,
} = require("../controllers/propertyController");

// ================= AUTH =================

const { protect } = require("../middleware/authMiddleware");

// ================= MULTER =================

const upload = require("../middleware/upload");

// ======================================================
// ================= ADD PROPERTY =======================
// ======================================================

router.post(
  "/add",

  protect,

  upload.array("images", 10),

  addProperty,
);

// ======================================================
// ================= GET PROPERTIES =====================
// ======================================================

router.get("/approved", getFilteredProperties);
// ======================================================
// ================= EXPORT =============================
// ======================================================
router.get("/:id", getPropertyById);

module.exports = router;
