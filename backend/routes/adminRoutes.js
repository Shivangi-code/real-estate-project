const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const Property = require("../models/Property");

const Lead = require("../models/Lead");

const {
protect,
authorizeRoles,
} = require("../middleware/authMiddleware");

// ================= VALIDATE ID =================
const isValidId = (id) =>
mongoose.Types.ObjectId.isValid(id);

// ================= REALTIME EMIT =================
const emitRealtimeUpdate = (
req,
property
) => {

const io =
req.app.get("io");

if (io) {


io.emit(
  "propertyUpdated",
  {
    propertyId:
      property._id,

    status:
      property.status,

    businessStatus:
      property.businessStatus,

    underNegotiation:
      property.underNegotiation,

    property,
  }
);


}
};

// ================= SAFE STATUS QUERY =================
const statusQuery = (
status
) => ({
$expr: {
$eq: [
{
$toLower: {
$trim: {
input: "$status",
},
},
},
status.toLowerCase(),
],
},
});

// ================= UPDATE MODERATION STATUS =================
const updatePropertyStatus =
async (
id,
newStatus,
adminId
) => {


const property =
  await Property.findById(
    id
  );

if (!property)
  return null;

property.status =
  newStatus
    .trim()
    .toLowerCase();

property.verifiedBy =
  adminId;

property.verifiedAt =
  new Date();

property.lastStatusChangedAt =
  new Date();

property.statusHistory.push(
  {
    status:
      newStatus
        .trim()
        .toLowerCase(),

    changedAt:
      new Date(),

    changedBy:
      adminId,
  }
);

await property.save();

return property;


};

// =====================================================
// GET ALL PROPERTIES
// =====================================================

router.get(
"/properties/all",

protect,

authorizeRoles(
"admin"
),

async (req, res) => {


try {

  const properties =
    await Property.find()
      .populate(
        "createdBy",
        "name role uniqueUserId"
      )
      .populate(
        "verifiedBy",
        "name uniqueUserId"
      )
      .sort({
        createdAt: -1,
      });

  res.json(
    properties
  );

} catch (err) {

  console.log(
    "ALL PROPERTIES ERROR:",
    err
  );

  res.status(500).json({
    message:
      "Server error",
  });
}


}
);

// =====================================================
// GET PENDING
// =====================================================

router.get(
"/properties/pending",

protect,

authorizeRoles(
"admin"
),

async (req, res) => {


try {

  const data =
    await Property.find(
      statusQuery(
        "pending"
      )
    )
      .populate(
        "createdBy",
        "name role uniqueUserId"
      )
      .populate(
        "verifiedBy",
        "name uniqueUserId"
      )
      .sort({
        createdAt: -1,
      });

  res.json(data);

} catch (err) {

  console.log(
    "PENDING FETCH ERROR:",
    err
  );

  res.status(500).json({
    message:
      "Server error",
  });
}


}
);

// =====================================================
// GET APPROVED
// =====================================================

router.get(
"/properties/approved",

protect,

authorizeRoles(
"admin"
),

async (req, res) => {


try {

  const data =
    await Property.find(
      statusQuery(
        "approved"
      )
    )
      .populate(
        "createdBy",
        "name role uniqueUserId"
      )
      .populate(
        "verifiedBy",
        "name uniqueUserId"
      )
      .sort({
        createdAt: -1,
      });

  res.json(data);

} catch (err) {

  console.log(
    "APPROVED FETCH ERROR:",
    err
  );

  res.status(500).json({
    message:
      "Server error",
  });
}


}
);

// =====================================================
// GET REJECTED
// =====================================================

router.get(
"/properties/rejected",

protect,

authorizeRoles(
"admin"
),

async (req, res) => {


try {

  const data =
    await Property.find(
      statusQuery(
        "rejected"
      )
    )
      .populate(
        "createdBy",
        "name role uniqueUserId"
      )
      .populate(
        "verifiedBy",
        "name uniqueUserId"
      )
      .sort({
        createdAt: -1,
      });

  res.json(data);

} catch (err) {

  console.log(
    "REJECTED FETCH ERROR:",
    err
  );

  res.status(500).json({
    message:
      "Server error",
  });
}


}
);

// =====================================================
// GET DELETED
// =====================================================

router.get(
"/properties/deleted",

protect,

authorizeRoles(
"admin"
),

async (req, res) => {


try {

  const data =
    await Property.find(
      statusQuery(
        "deleted"
      )
    )
      .populate(
        "createdBy",
        "name role uniqueUserId"
      )
      .populate(
        "verifiedBy",
        "name uniqueUserId"
      )
      .sort({
        createdAt: -1,
      });

  res.json(data);

} catch (err) {

  console.log(
    "DELETED FETCH ERROR:",
    err
  );

  res.status(500).json({
    message:
      "Server error",
  });
}


}
);

// =====================================================
// APPROVE PROPERTY
// =====================================================

router.put(
"/properties/:id/approve",

protect,

authorizeRoles(
"admin"
),

async (req, res) => {


try {

  const property =
    await updatePropertyStatus(
      req.params.id,
      "approved",
      req.user._id
    );

  if (!property) {

    return res.status(404).json({
      message:
        "Property not found",
    });
  }

  emitRealtimeUpdate(
    req,
    property
  );

  res.json({
    success: true,
    message:
      "Property approved successfully",
  });

} catch (err) {

  console.log(
    "APPROVE ERROR:",
    err
  );

  res.status(500).json({
    message:
      "Server error",
  });
}


}
);

// =====================================================
// REJECT PROPERTY
// =====================================================

router.put(
"/properties/:id/reject",

protect,

authorizeRoles(
"admin"
),

async (req, res) => {


try {

  const property =
    await updatePropertyStatus(
      req.params.id,
      "rejected",
      req.user._id
    );

  if (!property) {

    return res.status(404).json({
      message:
        "Property not found",
    });
  }

  emitRealtimeUpdate(
    req,
    property
  );

  res.json({
    success: true,
    message:
      "Property rejected successfully",
  });

} catch (err) {

  console.log(
    "REJECT ERROR:",
    err
  );

  res.status(500).json({
    message:
      "Server error",
  });
}


}
);

// =====================================================
// DELETE PROPERTY
// =====================================================

router.put(
"/properties/:id/delete",

protect,

authorizeRoles(
"admin"
),

async (req, res) => {


try {

  const property =
    await updatePropertyStatus(
      req.params.id,
      "deleted",
      req.user._id
    );

  if (!property) {

    return res.status(404).json({
      message:
        "Property not found",
    });
  }

  emitRealtimeUpdate(
    req,
    property
  );

  res.json({
    success: true,
    message:
      "Property deleted successfully",
  });

} catch (err) {

  console.log(
    "DELETE ERROR:",
    err
  );

  res.status(500).json({
    message:
      "Server error",
  });
}


}
);

// =====================================================
// BUSINESS STATUS SYSTEM
// =====================================================

router.put(
"/properties/:id/business-status",

protect,

authorizeRoles(
"admin"
),

async (req, res) => {


try {

  const {
    businessStatus,
    underNegotiation,
  } = req.body;

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

  if (
    businessStatus
  ) {

    property.businessStatus =
      businessStatus;
  }

  if (
    typeof underNegotiation ===
    "boolean"
  ) {

    property.underNegotiation =
      underNegotiation;
  }

  await property.save();

  emitRealtimeUpdate(
    req,
    property
  );

  res.json({
    success: true,
    message:
      "Business status updated successfully",
  });

} catch (error) {

  console.log(
    "BUSINESS STATUS ERROR:",
    error
  );

  res.status(500).json({
    success: false,
    message:
      "Server error",
  });
}


}
);

// =====================================================
// IMAGE MODERATION SYSTEM
// =====================================================

router.put(
"/property-image/:propertyId/:imageId/approve",

protect,

authorizeRoles("admin"),

async (req, res) => {


try {

  const { propertyId, imageId } = req.params;

  if (!isValidId(propertyId)) {

    return res.status(400).json({
      success: false,
      message: "Invalid property ID",
    });
  }

  const property =
    await Property.findById(propertyId);

  if (!property) {

    return res.status(404).json({
      success: false,
      message: "Property not found",
    });
  }

  const image =
    property.images.id(imageId);

  if (!image) {

    return res.status(404).json({
      success: false,
      message: "Image not found",
    });
  }

  image.status = "approved";

  image.verifiedBy = req.user._id;

  image.verifiedAt = new Date();

  await property.save();

  emitRealtimeUpdate(req, property);

  res.json({
    success: true,
    message: "Image approved successfully",
  });

} catch (error) {

  console.log(
    "IMAGE APPROVE ERROR:",
    error
  );

  res.status(500).json({
    success: false,
    message: "Server error",
  });
}


}
);

router.put(
"/property-image/:propertyId/:imageId/reject",

protect,

authorizeRoles("admin"),

async (req, res) => {


try {

  const { propertyId, imageId } = req.params;

  if (!isValidId(propertyId)) {

    return res.status(400).json({
      success: false,
      message: "Invalid property ID",
    });
  }

  const property =
    await Property.findById(propertyId);

  if (!property) {

    return res.status(404).json({
      success: false,
      message: "Property not found",
    });
  }

  const image =
    property.images.id(imageId);

  if (!image) {

    return res.status(404).json({
      success: false,
      message: "Image not found",
    });
  }

  image.status = "rejected";

  image.verifiedBy = req.user._id;

  image.verifiedAt = new Date();

  await property.save();

  emitRealtimeUpdate(req, property);

  res.json({
    success: true,
    message: "Image rejected successfully",
  });

} catch (error) {

  console.log(
    "IMAGE REJECT ERROR:",
    error
  );

  res.status(500).json({
    success: false,
    message: "Server error",
  });
}


}
);

// =====================================================
// LEADS DASHBOARD
// =====================================================

router.get(
"/leads/all",

protect,

authorizeRoles(
"admin"
),

async (req, res) => {


try {

  const leads =
    await Lead.find()
      .sort({
        createdAt: -1,
      });

  res.json(leads);

} catch (error) {

  console.log(
    "LEADS ERROR:",
    error
  );

  res.status(500).json({
    message:
      "Server error",
  });
}


}
);

module.exports = router;
