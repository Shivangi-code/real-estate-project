const express =
  require("express");

const router =
  express.Router();

// ======================================================
// ================= CONTROLLERS ========================
// ======================================================

const {

  addProperty,

  getFilteredProperties,

  getMyProperties,

  getSingleProperty,

  updateProperty,

  deleteProperty,

  restoreProperty,

} = require(
  "../controllers/propertyController"
);

// ======================================================
// ================= AUTH MIDDLEWARE ====================
// ======================================================

const {

  protect,

} = require(
  "../middleware/authMiddleware"
);

// ======================================================
// ================= MULTER =============================
// ======================================================

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
// ================= GET MY PROPERTIES ==================
// ======================================================

router.get(

  "/my-properties",

  protect,

  getMyProperties
);

// ======================================================
// ================= UPDATE PROPERTY ====================
// ======================================================

router.put(

  "/update/:id",

  protect,

  upload.array(
    "images",
    10
  ),

  updateProperty
);

// ======================================================
// ================= DELETE PROPERTY ====================
// ======================================================

router.delete(

  "/delete/:id",

  protect,

  deleteProperty
);

// ======================================================
// ================= RESTORE PROPERTY ===================
// ======================================================

router.patch(

  "/restore/:id",

  protect,

  restoreProperty
);

// ======================================================
// ================= GET APPROVED PROPERTIES ============
// ======================================================

router.get(

  "/approved",

  getFilteredProperties
);

// ======================================================
// ================= GET ALL PUBLIC PROPERTIES ==========
// ======================================================

router.get(

  "/",

  getFilteredProperties
);

// ======================================================
// ================= GET SINGLE PROPERTY ================
// ======================================================

// IMPORTANT:
// This MUST remain PUBLIC
// because approved properties
// should be viewable by:
// buyers
// guests
// sellers
// builders
// admins

// IMPORTANT:
// Keep this route LAST
// so it does not override
// static routes like:
//
// /update/:id
// /delete/:id
// /restore/:id

router.get(

  "/:id",

  getSingleProperty
);

// ======================================================
// ================= EXPORT =============================
// ======================================================

module.exports =
  router;