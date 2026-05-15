const multer = require("multer");

const {
  CloudinaryStorage,
} = require(
  "multer-storage-cloudinary"
);

const cloudinary =
  require("../config/cloudinary");

// ======================================================
// ================= CLOUDINARY STORAGE =================
// ======================================================

const storage =
  new CloudinaryStorage({
    cloudinary,

    params: async (
      req,
      file
    ) => {

      return {
        folder:
          "real-estate-properties",

        allowed_formats: [
          "jpg",
          "jpeg",
          "png",
          "webp",
        ],

        transformation: [
          {
            width: 1600,
            crop: "limit",
            quality: "auto",
          },
        ],

        public_id: `${Date.now()}-${Math.round(
          Math.random() *
            1e9
        )}`,
      };
    },
  });

// ======================================================
// ================= FILE FILTER ========================
// ======================================================

const fileFilter = (
  req,
  file,
  cb
) => {

  const allowedTypes =
    [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

  if (
    allowedTypes.includes(
      file.mimetype
    )
  ) {

    cb(null, true);

  } else {

    cb(
      new Error(
        "Only JPG, PNG and WEBP images are allowed"
      ),
      false
    );
  }
};

// ======================================================
// ================= MULTER CONFIG ======================
// ======================================================

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize:
      5 * 1024 * 1024,

    files: 15,
  },
});

module.exports =
  upload;