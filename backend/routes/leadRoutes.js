const express = require("express");

const router = express.Router();

const mongoose = require("mongoose");

const Lead = require("../models/Lead");

const Property = require("../models/Property");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// ================= HELPERS =================

// Validate ObjectId
const isValidId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

// ================= REALTIME EMIT =================
const emitLeadUpdate = (
  req,
  lead
) => {

  const io =
    req.app.get("io");

  if (io) {

    io.emit(
      "leadUpdated",
      {
        leadId:
          lead._id,

        status:
          lead.status,

        lead,
      }
    );
  }
};

// =====================================================
// CREATE PROPERTY INQUIRY LEAD
// =====================================================

router.post(
  "/create",

  async (req, res) => {

    try {

      const {
        propertyId,
        buyerName,
        buyerEmail,
        buyerMobile,
        buyerCity,
        message,
      } = req.body;

      // ================= VALIDATION =================
      if (
        !propertyId ||
        !buyerName ||
        !buyerMobile
      ) {

        return res
          .status(400)
          .json({
            success: false,

            message:
              "Required fields missing",
          });
      }

      // ================= PROPERTY =================
      const property =
        await Property.findById(
          propertyId
        );

      if (!property) {

        return res
          .status(404)
          .json({
            success: false,

            message:
              "Property not found",
          });
      }

      // ================= PROPERTY UNIQUE ID =================
      const propertyUniqueId =
        `RE-${property._id
          .toString()
          .slice(-8)
          .toUpperCase()}`;

      // ================= CREATE LEAD =================
      const lead =
        await Lead.create({
          leadType:
            "property-inquiry",

          propertyId:
            property._id,

          propertyTitle:
            property.title,

          propertyUniqueId,

          buyerName,

          buyerEmail,

          buyerMobile,

          buyerCity,

          message,

          propertyOwner:
            property.createdBy,

          createdBy:
            null,

          status: "new",

          source:
            "website",

          priority:
            "medium",

          statusHistory: [
            {
              status:
                "new",

              changedAt:
                new Date(),
            },
          ],
        });

      // ================= REALTIME =================
      emitLeadUpdate(
        req,
        lead
      );

      // ================= RESPONSE =================
      res.status(201).json({
        success: true,

        message:
          "Inquiry submitted successfully 🚀",

        lead,
      });

    } catch (error) {

      console.log(
        "CREATE LEAD ERROR:",
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
// CREATE CONTACT-US LEAD
// =====================================================

router.post(
  "/contact-us",

  async (req, res) => {

    try {

      const {
        buyerName,
        buyerEmail,
        buyerMobile,
        buyerCity,
        message,
      } = req.body;

      // ================= VALIDATION =================
      if (
        !buyerName ||
        !buyerMobile
      ) {

        return res
          .status(400)
          .json({
            success: false,

            message:
              "Name and mobile are required",
          });
      }

      // ================= CREATE =================
      const lead =
        await Lead.create({
          leadType:
            "contact-us",

          buyerName,

          buyerEmail,

          buyerMobile,

          buyerCity,

          message,

          status: "new",

          source:
            "contact-form",

          priority:
            "medium",

          statusHistory: [
            {
              status:
                "new",

              changedAt:
                new Date(),
            },
          ],
        });

      // ================= REALTIME =================
      emitLeadUpdate(
        req,
        lead
      );

      // ================= RESPONSE =================
      res.status(201).json({
        success: true,

        message:
          "Contact request submitted successfully 🚀",

        lead,
      });

    } catch (error) {

      console.log(
        "CONTACT LEAD ERROR:",
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
// GET ALL LEADS (ADMIN)
// =====================================================

router.get(
  "/all",

  protect,

  authorizeRoles(
    "admin"
  ),

  async (req, res) => {

    try {

      const leads =
        await Lead.find()
          .populate(
            "propertyId",
            "title image"
          )
          .populate(
            "propertyOwner",
            "name email role"
          )
          .sort({
            createdAt: -1,
          });

      res.json(leads);

    } catch (error) {

      console.log(
        "GET ALL LEADS ERROR:",
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
// GET SELLER/BUILDER LEADS
// =====================================================

router.get(
  "/my-leads",

  protect,

  authorizeRoles(
    "seller",
    "builder",
    "agent"
  ),

  async (req, res) => {

    try {

      const leads =
        await Lead.find({
          propertyOwner:
            req.user._id,
        })
          .populate(
            "propertyId",
            "title image"
          )
          .sort({
            createdAt: -1,
          });

      res.json(leads);

    } catch (error) {

      console.log(
        "MY LEADS ERROR:",
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
// UPDATE LEAD STATUS
// =====================================================

router.put(
  "/:id/status",

  protect,

  authorizeRoles(
    "admin",
    "seller",
    "builder",
    "agent"
  ),

  async (req, res) => {

    try {

      const {
        status,
        note,
      } = req.body;

      // ================= VALIDATION =================
      const allowedStatuses =
        [
          "new",
          "in-progress",
          "contacted",
          "closed",
          "spam",
        ];

      if (
        !allowedStatuses.includes(
          status
        )
      ) {

        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid status",
          });
      }

      // ================= FIND LEAD =================
      const lead =
        await Lead.findById(
          req.params.id
        );

      if (!lead) {

        return res
          .status(404)
          .json({
            success: false,

            message:
              "Lead not found",
          });
      }

      // ================= ACCESS CONTROL =================
      if (
        req.user.role !==
          "admin" &&
        lead.propertyOwner?.toString() !==
          req.user._id.toString()
      ) {

        return res
          .status(403)
          .json({
            success: false,

            message:
              "Access denied",
          });
      }

      // ================= UPDATE =================
      lead.status = status;

      lead.lastStatusChangedAt =
        new Date();

      // ================= CONTACTED =================
      if (
        status ===
        "contacted"
      ) {

        lead.contactedAt =
          new Date();
      }

      // ================= CLOSED =================
      if (
        status === "closed"
      ) {

        lead.closedAt =
          new Date();
      }

      // ================= HISTORY =================
      lead.statusHistory.push(
        {
          status,

          changedAt:
            new Date(),

          changedBy:
            req.user._id,

          note:
            note || "",
        }
      );

      await lead.save();

      // ================= REALTIME =================
      emitLeadUpdate(
        req,
        lead
      );

      // ================= RESPONSE =================
      res.json({
        success: true,

        message:
          `Lead marked as ${status}`,

        lead,
      });

    } catch (error) {

      console.log(
        "UPDATE LEAD STATUS ERROR:",
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
// GET SINGLE LEAD
// =====================================================

router.get(
  "/:id",

  protect,

  async (req, res) => {

    try {

      if (
        !isValidId(
          req.params.id
        )
      ) {

        return res
          .status(400)
          .json({
            success: false,

            message:
              "Invalid lead ID",
          });
      }

      const lead =
        await Lead.findById(
          req.params.id
        )
          .populate(
            "propertyId"
          )
          .populate(
            "propertyOwner",
            "name email role"
          );

      if (!lead) {

        return res
          .status(404)
          .json({
            success: false,

            message:
              "Lead not found",
          });
      }

      res.json(lead);

    } catch (error) {

      console.log(
        "GET LEAD ERROR:",
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

module.exports =
  router;