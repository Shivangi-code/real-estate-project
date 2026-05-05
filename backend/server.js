require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ================= ROUTES =================
const propertyRoutes = require("./routes/propertyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userAuthRoutes = require("./routes/userAuthRoutes");
const contactRoutes = require("./routes/contactRoutes");
const leadRoutes = require("./routes/leadRoutes");

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ STATIC FILES
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ================= API ROUTES =================
app.use("/api/property", propertyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user-auth", userAuthRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/lead", leadRoutes);

// ================= SYSTEM ROUTES =================
app.get("/favicon.ico", (req, res) =>
  res.sendStatus(204)
);

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// ================= 404 (LAST ROUTE) =================
app.use((req, res) => {
  console.log("❌ Route not found:", req.originalUrl);

  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack);

  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
});

// ================= DATABASE =================
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error(
      "MongoDB Error ❌",
      error.message
    );
    process.exit(1);
  }
};

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT} 🚀`
    );
  });
};

startServer();