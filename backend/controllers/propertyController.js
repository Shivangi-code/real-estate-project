const Property =
  require("../models/Property");

// ======================================================
// ================= ADD PROPERTY =======================
// ======================================================

exports.addProperty =
  async (req, res) => {

    try {

      console.log(
        "REQ BODY =>",
        req.body
      );

      // ================= IMAGES =================

      const uploadedFiles =
        req.files || [];

      const images =
        uploadedFiles.map(
          (file) => ({
            filename:
              file.filename,

            url:
              file.path,

            uploadedBy:
              req.user.id,

            status:
              "approved",
          })
        );

      // ================= MAIN IMAGE =================

      const imageUrl =
        images[0]?.url || "";

      // ================= CREATE PROPERTY =================

      const property =
        await Property.create({

          title:
            req.body.title,

          price:
            Number(
              req.body.price
            ) || 0,

          // AREA
          area:
            Number(
              req.body.area
            ) || 0,

          areaUnit:
            req.body.areaUnit ||
            "sqft",

          // LOCATION
          location:
            req.body.location,

          // TYPE
          type:
            req.body.type,

          subType:
            req.body.subType || "",

          // CONSTRUCTION
          constructionStatus:
            req.body.constructionStatus,

          // DESCRIPTION
          description:
            req.body.description,

          // STATUS
          businessStatus:
            "available",

          underNegotiation:
            false,

          // IMAGES
          image:
            imageUrl,

          images,

          // OWNER
          createdBy:
            req.user.id,

          createdByRole:
            req.user.role || "",

          ownerUniqueId:
            req.user.uniqueUserId || "",

          ownerName:
            req.user.name || "",
        });

      res.status(201).json({
        success: true,

        message:
          "Property added successfully 🚀",

        property,
      });

    } catch (error) {

      console.log(
        "Add Property Error ❌",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  };

// ======================================================
// ================= GET FILTERED PROPERTIES ============
// ======================================================

exports.getFilteredProperties =
  async (req, res) => {

    try {

      console.log(
        "GET PROPERTIES API HIT 🚀"
      );

      const properties =
        await Property.find({})
          .sort({
            createdAt: -1,
          });

      console.log(
        "TOTAL PROPERTIES =>",
        properties.length
      );

      res.status(200).json({
        success: true,
        properties,
      });

    } catch (err) {

      console.log(
        "Property Filter Error ❌",
        err
      );

      res.status(500).json({
        success: false,
        message:
          "Server error",
      });
    }
  };

// ======================================================
// ================= GET SINGLE PROPERTY ================
// ======================================================

exports.getSingleProperty =
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

      res.status(200).json({
        success: true,
        property,
      });

    } catch (error) {

      console.log(
        "Single Property Error ❌",
        error
      );

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };