require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const propertyRoutes = require("./routes/propertyRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes"); // ✅ ADD

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use("/property", propertyRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/api/contact", contactRoutes); // ✅ ADD

app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});