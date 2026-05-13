const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const http = require("http");

// ✅ SOCKET.IO
const { Server } = require("socket.io");

dotenv.config();

const app = express();

// ================= SERVER =================
const server = http.createServer(app);

// ================= SOCKET =================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// ✅ MAKE SOCKET AVAILABLE EVERYWHERE
app.set("io", io);

// ================= SOCKET EVENTS =================
io.on("connection", (socket) => {

  console.log(
    "⚡ User Connected:",
    socket.id
  );

  socket.on("disconnect", () => {

    console.log(
      "❌ User Disconnected:",
      socket.id
    );
  });
});

// ================= MIDDLEWARE =================
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
  extended: true,
}));

// ================= ROUTES =================
app.use(
  "/api/user-auth",
  require("./routes/userAuthRoutes")
);

app.use(
  "/api/properties",
  require("./routes/propertyRoutes")
);

app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);

// ================= MONGODB =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {

    console.log("MongoDB Connected ✅");

    // ✅ START SERVER
    server.listen(
      process.env.PORT || 5000,
      () => {

        console.log(
          `Server running on port ${
            process.env.PORT || 5000
          } 🚀`
        );
      }
    );
  })
  .catch((err) => {

    console.log(
      "MongoDB Error:",
      err
    );
  });