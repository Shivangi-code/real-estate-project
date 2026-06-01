const express =
  require("express");

const router =
  express.Router();

// ================= CONTROLLER =================

const {
  addProperty,
  getFilteredProperties,
} = require(
  "../controllers/propertyController"
);

// ================= AUTH =================

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

// ================= MULTER =================

const upload =
  require(
    "../middleware/upload"
  );

// ======================================================
// ================= ADD PROPERTY =======================
// ======================================================

router.post(

  "/add",

  protect,

  upload.array(
    "images",
    10
  ),

  addProperty
);

// ======================================================
// ================= GET PROPERTIES =====================
// ======================================================

router.get(
  "/approved",
  getFilteredProperties
);
// ======================================================
// ================= EXPORT =============================
// ======================================================

module.exports =
  router;