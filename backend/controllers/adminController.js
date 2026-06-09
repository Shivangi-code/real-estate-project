const Property =
  require(
    "../models/Property"
  );

// ======================================================
// ================= ADMIN STATS ========================
// ======================================================

exports.getAdminStats =
  async (req, res) => {

    try {

      // ======================================================
      // ================= TOTAL ==============================
      // ======================================================

      const totalProperties =
        await Property.countDocuments();

      // ======================================================
      // ================= APPROVED ==========================
      // ======================================================

      const approvedProperties =
        await Property.countDocuments({

          status: "approved",
        });

      // ======================================================
      // ================= PENDING ===========================
      // ======================================================

      const pendingProperties =
        await Property.countDocuments({

          status: "pending",
        });

      // ======================================================
      // ================= REJECTED ==========================
      // ======================================================

      const rejectedProperties =
        await Property.countDocuments({

          status: "rejected",
        });

      // ======================================================
      // ================= DELETED ===========================
      // ======================================================

      const deletedProperties =
        await Property.countDocuments({

          status: "deleted",
        });

      // ======================================================
      // ================= RESPONSE ==========================
      // ======================================================

      res.status(200).json({

        success: true,

        stats: {

          totalProperties,

          approvedProperties,

          pendingProperties,

          rejectedProperties,

          deletedProperties,
        },
      });

    } catch (error) {

      console.log(

        "ADMIN STATS ERROR:",

        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch admin stats",
      });
    }
  };