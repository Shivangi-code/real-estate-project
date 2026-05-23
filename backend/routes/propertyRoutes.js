const express =
  require("express");

const router =
  express.Router();

// ================= CONTROLLERS =================

const propertyController =
  require(
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

  propertyController.addProperty
);

// ======================================================
// ================= GET ALL PROPERTIES =================
// ======================================================

router.get(
  "/approved",
  propertyController.getFilteredProperties
);

// ======================================================
// ================= GET SINGLE PROPERTY ================
// ======================================================

router.get(
  "/:id",
  propertyController.getSingleProperty
);

// ======================================================
// ================= EXPORT =============================
// ======================================================

module.exports =
  router;