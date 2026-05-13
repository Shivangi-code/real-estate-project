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

// ================= REALTIME EMIT =================
const emitRealtimeUpdate = (
  req,
  property
) => {

  const io = req.app.get("io");

  if (io) {
    io.emit("propertyUpdated", {
      propertyId: property._id,
      status: property.status,
      property,
    });
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

// ================= UPDATE STATUS =================
const updatePropertyStatus = async (
  id,
  newStatus,
  adminId
) => {

  const property =
    await Property.findById(id);

  if (!property) return null;

  property.status =
    newStatus.trim().toLowerCase();

  property.verifiedBy =
    adminId;

  property.verifiedAt =
    new Date();

  property.lastStatusChangedAt =
    new Date();

  property.statusHistory.push({
    status:
      newStatus.trim().toLowerCase(),
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

      const properties =
        await Property.find()
          .populate(
            "createdBy",
            "name role"
          )
          .populate(
            "verifiedBy",
            "name"
          )
          .sort({
            createdAt: -1,
          });

      res.json(properties);

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

// ================= GET PENDING =================
router.get(
  "/properties/pending",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {

    try {

      const data =
        await Property.find(
          statusQuery("pending")
        )
          .populate(
            "createdBy",
            "name role"
          )
          .populate(
            "verifiedBy",
            "name"
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

// ================= GET APPROVED =================
router.get(
  "/properties/approved",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {

    try {

      const data =
        await Property.find(
          statusQuery("approved")
        )
          .populate(
            "createdBy",
            "name role"
          )
          .populate(
            "verifiedBy",
            "name"
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

// ================= GET REJECTED =================
router.get(
  "/properties/rejected",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {

    try {

      const data =
        await Property.find(
          statusQuery("rejected")
        )
          .populate(
            "createdBy",
            "name role"
          )
          .populate(
            "verifiedBy",
            "name"
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

// ================= GET DELETED =================
router.get(
  "/properties/deleted",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {

    try {

      const data =
        await Property.find(
          statusQuery("deleted")
        )
          .populate(
            "createdBy",
            "name role"
          )
          .populate(
            "verifiedBy",
            "name"
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

// ================= APPROVE =================
router.put(
  "/property/:id/approve",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {

    try {

      if (
        !isValidId(
          req.params.id
        )
      ) {

        return res.status(400).json({
          message:
            "Invalid ID",
        });
      }

      const property =
        await updatePropertyStatus(
          req.params.id,
          "approved",
          req.user._id
        );

      emitRealtimeUpdate(
        req,
        property
      );

      res.json({
        message:
          "Approved",
        property,
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

// ================= REJECT =================
router.put(
  "/property/:id/reject",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {

    try {

      const property =
        await updatePropertyStatus(
          req.params.id,
          "rejected",
          req.user._id
        );

      emitRealtimeUpdate(
        req,
        property
      );

      res.json({
        message:
          "Rejected",
        property,
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

// ================= PENDING =================
router.put(
  "/property/:id/pending",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {

    try {

      const property =
        await updatePropertyStatus(
          req.params.id,
          "pending",
          req.user._id
        );

      emitRealtimeUpdate(
        req,
        property
      );

      res.json({
        message:
          "Moved to pending",
        property,
      });

    } catch (err) {

      console.log(
        "PENDING UPDATE ERROR:",
        err
      );

      res.status(500).json({
        message:
          "Server error",
      });
    }
  }
);

// ================= DELETE =================
router.put(
  "/property/:id/delete",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {

    try {

      const property =
        await updatePropertyStatus(
          req.params.id,
          "deleted",
          req.user._id
        );

      emitRealtimeUpdate(
        req,
        property
      );

      res.json({
        message:
          "Property moved to deleted",
        property,
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

// ================= GENERIC STATUS =================
router.put(
  "/property/:id/status",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {

    try {

      const { status } =
        req.body;

      const allowed = [
        "pending",
        "approved",
        "rejected",
        "deleted",
      ];

      if (
        !allowed.includes(
          status
        )
      ) {

        return res.status(400).json({
          message:
            "Invalid status",
        });
      }

      const property =
        await updatePropertyStatus(
          req.params.id,
          status,
          req.user._id
        );

      emitRealtimeUpdate(
        req,
        property
      );

      res.json({
        message:
          `Property moved to ${status}`,
        property,
      });

    } catch (err) {

      console.log(
        "STATUS ERROR:",
        err
      );

      res.status(500).json({
        message:
          "Server error",
      });
    }
  }
);

// ================= STATS =================
router.get(
  "/stats",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {

    try {

      const total =
        await Property.countDocuments();

      const pending =
        await Property.countDocuments(
          statusQuery("pending")
        );

      const approved =
        await Property.countDocuments(
          statusQuery("approved")
        );

      const rejected =
        await Property.countDocuments(
          statusQuery("rejected")
        );

      const deleted =
        await Property.countDocuments(
          statusQuery("deleted")
        );

      res.json({
        total,
        pending,
        approved,
        rejected,
        deleted,
      });

    } catch (err) {

      console.log(
        "STATS ERROR:",
        err
      );

      res.status(500).json({
        message:
          "Server error",
      });
    }
  }
);

module.exports = router;