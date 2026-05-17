const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const Property = require("../models/Property");

const User = require("../models/User");

const upload = require("../middleware/upload");

const {
protect,
authorizeRoles,
} = require("../middleware/authMiddleware");

// ======================================================
// ================= HELPERS ============================
// ======================================================

const isValidId = (id) =>
mongoose.Types.ObjectId.isValid(id);

// ======================================================
// ================= REALTIME EMIT ======================
// ======================================================

const emitRealtimeUpdate = (
req,
property
) => {

const io = req.app.get("io");

if (io) {


io.emit(
  "propertyUpdated",
  {
    propertyId: property._id,
    status: property.status,
    businessStatus:
      property.businessStatus,
    underNegotiation:
      property.underNegotiation,
    property,
  }
);


}
};

// ======================================================
// ================= APPROVED IMAGES ====================
// ======================================================

const getApprovedImages = (
property
) =>
(
property.images || []
).filter(
(image) =>
image.status === "approved"
);

// ======================================================
// ================= MAP PROPERTY =======================
// ======================================================

const mapApprovedImages = (
property
) => {

const doc =
property.toObject
? property.toObject()
: property;

const approvedImages =
getApprovedImages(doc);

return {
...doc,


image:
  approvedImages[0]?.url ||
  doc.image ||
  null,

images: approvedImages,


};
};

// ======================================================
// ================= ADVANCED SEARCH ====================
// ======================================================

router.get(
"/search",

async (req, res) => {


try {

  const {
    search,
    type,
    minPrice,
    maxPrice,
    businessStatus,
    underNegotiation,
    sort,
  } = req.query;

  const query = {
    status: "approved",
  };

  // ================= SEARCH =================
  if (search) {

    query.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },

      {
        location: {
          $regex: search,
          $options: "i",
        },
      },

      {
        subType: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // ================= TYPE =================
  if (type) {

    query.type = type;
  }

  // ================= PRICE =================
  if (
    minPrice ||
    maxPrice
  ) {

    query.price = {};

    if (minPrice) {

      query.price.$gte =
        Number(minPrice);
    }

    if (maxPrice) {

      query.price.$lte =
        Number(maxPrice);
    }
  }

  // ================= BUSINESS STATUS =================
  if (businessStatus) {

    query.businessStatus =
      businessStatus;
  }

  // ================= NEGOTIATION =================
  if (
    underNegotiation ===
    "true"
  ) {

    query.underNegotiation = true;
  }

  // ================= SORT =================
  let sortOption = {
    createdAt: -1,
  };

  if (sort === "price-low") {

    sortOption = {
      price: 1,
    };
  }

  if (sort === "price-high") {

    sortOption = {
      price: -1,
    };
  }

  if (sort === "oldest") {

    sortOption = {
      createdAt: 1,
    };
  }

  const properties =
    await Property.find(query)
      .populate(
        "createdBy",
        "name role uniqueUserId"
      )
      .sort(sortOption);

  const formatted =
    properties.map(
      mapApprovedImages
    );

  res.json(formatted);

} catch (error) {

  console.log(
    "ADVANCED SEARCH ERROR:",
    error
  );

  res.status(500).json({
    success: false,
    message: "Server error",
  });
}


}
);

// ======================================================
// ================= ADD PROPERTY =======================
// ======================================================

router.post(
"/add",

protect,

authorizeRoles(
"seller",
"builder",
"admin"
),

upload.array("images", 15),

async (req, res) => {


try {

  const isAdmin =
    req.user.role === "admin";

  const uploadedImages =
    req.files || [];

  const images =
    uploadedImages.map(
      (file) => ({
        filename:
          file.filename,

        url: file.path,

        uploadedBy:
          req.user._id,

        status:
          "approved",

        verifiedBy:
          isAdmin
            ? req.user._id
            : null,

        verifiedAt:
          isAdmin
            ? new Date()
            : null,
      })
    );

  const primaryImage =
    images[0]?.url || null;

  const property =
    new Property({
      title: req.body.title,
      price: req.body.price,
      location:
        req.body.location,
      type: req.body.type,
      subType:
        req.body.subType,
      constructionStatus:
        req.body
          .constructionStatus,
      description:
        req.body.description,

      image: primaryImage,

      images,

      status: isAdmin
        ? "approved"
        : "pending",

      createdBy:
        req.user._id,

      createdByRole:
        req.user.role,

      ownerUniqueId:
        req.user
          .uniqueUserId ||
        "",

      ownerName:
        req.user.name || "",

      verifiedBy: isAdmin
        ? req.user._id
        : null,

      verifiedAt: isAdmin
        ? new Date()
        : null,
    });

  await property.save();

  emitRealtimeUpdate(
    req,
    property
  );

  res.status(201).json({
    success: true,
    message:
      isAdmin
        ? "Property approved & added"
        : "Property submitted for review",
    property,
  });

} catch (error) {

  console.log(
    "ADD PROPERTY ERROR:",
    error
  );

  res.status(500).json({
    success: false,
    message: "Server error",
  });
}


}
);

// ======================================================
// ================= GET APPROVED =======================
// ======================================================

router.get(
"/approved",

async (req, res) => {


try {

  const properties =
    await Property.find({
      status: "approved",
    })
      .populate(
        "createdBy",
        "name role uniqueUserId"
      )
      .sort({
        createdAt: -1,
      });

  const formatted =
    properties.map(
      mapApprovedImages
    );

  res.json(formatted);

} catch (error) {

  console.log(
    "APPROVED FETCH ERROR:",
    error
  );

  res.status(500).json({
    success: false,
    message: "Server error",
  });
}


}
);

// ======================================================
// ================= GET PROPERTY DETAILS ===============
// ======================================================

router.get(
"/:id",

async (req, res) => {


try {

  if (
    !isValidId(
      req.params.id
    )
  ) {

    return res.status(400).json({
      success: false,
      message:
        "Invalid property ID",
    });
  }

  const property =
    await Property.findById(
      req.params.id
    )
      .populate(
        "createdBy",
        "name role uniqueUserId"
      )
      .populate(
        "verifiedBy",
        "name uniqueUserId"
      );

  if (!property) {

    return res.status(404).json({
      success: false,
      message:
        "Property not found",
    });
  }

  res.json(
    mapApprovedImages(
      property
    )
  );

} catch (error) {

  console.log(
    "PROPERTY DETAILS ERROR:",
    error
  );

  res.status(500).json({
    success: false,
    message: "Server error",
  });
}


}
);

// ======================================================
// ================= MY PROPERTIES ======================
// ======================================================

router.get(
"/my-properties",

protect,

async (req, res) => {


try {

  const properties =
    await Property.find({
      createdBy:
        req.user._id,
    }).sort({
      createdAt: -1,
    });

  res.json(properties);

} catch (error) {

  console.log(
    "MY PROPERTIES ERROR:",
    error
  );

  res.status(500).json({
    success: false,
    message: "Server error",
  });
}


}
);

// ======================================================
// ================= DELETE PROPERTY ====================
// ======================================================

router.delete(
"/:id",

protect,

async (req, res) => {


try {

  const property =
    await Property.findById(
      req.params.id
    );

  if (!property) {

    return res.status(404).json({
      success: false,
      message:
        "Property not found",
    });
  }

  const isOwner =
    property.createdBy.toString() ===
    req.user._id.toString();

  const isAdmin =
    req.user.role === "admin";

  if (
    !isOwner &&
    !isAdmin
  ) {

    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  await Property.findByIdAndDelete(
    req.params.id
  );

  res.json({
    success: true,
    message:
      "Property deleted successfully",
  });

} catch (error) {

  console.log(
    "DELETE PROPERTY ERROR:",
    error
  );

  res.status(500).json({
    success: false,
    message: "Server error",
  });
}


}
);

module.exports = router;
