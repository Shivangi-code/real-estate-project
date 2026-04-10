require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();


// ================= ROUTES =================
const propertyRoutes = require("./routes/propertyRoutes");
const authRoutes = require("./routes/authRoutes");        // seller/admin
const adminRoutes = require("./routes/adminRoutes");
const userAuthRoutes = require("./routes/userAuthRoutes"); // buyer


// ================= MIDDLEWARE =================

// ✅ CORS (keep open for now, restrict later)
app.use(cors({
  origin: "*",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static uploads
app.use("/uploads", express.static("uploads"));


// ================= API ROUTES =================
app.use("/api/property", propertyRoutes);
app.use("/api/auth", authRoutes);          // seller/admin
app.use("/api/admin", adminRoutes);        // admin
app.use("/api/user-auth", userAuthRoutes); // buyer


// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});


// ================= 404 HANDLER =================
app.use((req, res) => {
  console.log("❌ Route not found:", req.originalUrl);

  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl, // ✅ helpful debug
  });
});


// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack);

  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
});


// ================= DATABASE CONNECTION =================
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("MongoDB Error ❌", error.message);
    process.exit(1);
  }
};


// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
    console.log(`User Auth API: http://localhost:${PORT}/api/user-auth`);
  });
};

startServer();