require("dns").setDefaultResultOrder("ipv4first");

const express =
  require("express");

const mongoose =
  require("mongoose");

const cors =
  require("cors");

const dotenv =
  require("dotenv");

const http =
  require("http");

// ======================================================
// ================= RATE LIMIT =========================
// ======================================================

const rateLimit =
  require(
    "express-rate-limit"
  );

// ======================================================
// ================= SOCKET.IO ==========================
// ======================================================

const {
  Server,
} = require(
  "socket.io"
);

dotenv.config();

// ======================================================
// ================= EXPRESS ============================
// ======================================================

const app =
  express();

// ======================================================
// ================= HTTP SERVER ========================
// ======================================================

const server =
  http.createServer(
    app
  );

// ======================================================
// ================= SOCKET SERVER ======================
// ======================================================

const io =
  new Server(
    server,
    {
      cors: {
        origin:
          "http://localhost:5173",

        credentials: true,
      },
    }
  );

// ======================================================
// ================= GLOBAL SOCKET ======================
// ======================================================

app.set(
  "io",
  io
);

// ======================================================
// ================= SOCKET EVENTS ======================
// ======================================================

io.on(
  "connection",

  (
    socket
  ) => {

    console.log(
      "⚡ User Connected:",
      socket.id
    );

    // ================= DISCONNECT =================

    socket.on(
      "disconnect",

      () => {

        console.log(
          "❌ User Disconnected:",
          socket.id
        );
      }
    );
  }
);

// ======================================================
// ================= RATE LIMITERS ======================
// ======================================================

// ================= GLOBAL LIMIT =================

const globalLimiter =
  rateLimit({
    windowMs:
      15 *
      60 *
      1000,

    max: 300,

    message: {
      success: false,

      message:
        "Too many requests. Please try again later.",
    },

    standardHeaders:
      true,

    legacyHeaders:
      false,
  });

// ================= AUTH LIMIT =================

const authLimiter =
  rateLimit({
    windowMs:
      15 *
      60 *
      1000,

    max: 20,

    message: {
      success: false,

      message:
        "Too many authentication attempts. Please try again later.",
    },

    standardHeaders:
      true,

    legacyHeaders:
      false,
  });

// ======================================================
// ================= MIDDLEWARE =========================
// ======================================================

// ================= GLOBAL RATE LIMIT =================

app.use(
  globalLimiter
);

// ================= CORS =================

app.use(
  cors({
    origin:
      "http://localhost:5173",

    credentials: true,
  })
);

// ================= BODY PARSERS =================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,

    limit: "10mb",
  })
);

// ======================================================
// ================= API ROUTES =========================
// ======================================================

// ================= AUTH =================

app.use(
  "/api/user-auth",

  authLimiter,

  require(
    "./routes/userAuthRoutes"
  )
);

// ================= PROPERTIES =================

app.use(
  "/api/properties",

  require(
    "./routes/propertyRoutes"
  )
);

// ================= ADMIN =================

app.use(
  "/api/admin",

  require(
    "./routes/adminRoutes"
  )
);

// ================= LEADS =================

app.use(
  "/api/leads",

  require(
    "./routes/leadRoutes"
  )
);

// ======================================================
// ================= HEALTH CHECK =======================
// ======================================================

app.get(
  "/",

  (
    req,
    res
  ) => {

    res.json({
      success: true,

      message:
        "Real Estate API Running 🚀",

      environment:
        process.env
          .NODE_ENV ||
        "development",
    });
  }
);

// ======================================================
// ================= 404 HANDLER ========================
// ======================================================

app.use(
  (
    req,
    res
  ) => {

    res.status(404).json({
      success: false,

      message:
        "API Route Not Found",
    });
  }
);

// ======================================================
// ================= GLOBAL ERROR HANDLER ===============
// ======================================================

app.use(
  (
    err,
    req,
    res,
    next
  ) => {

    console.log(
      "SERVER ERROR:",
      err
    );

    res.status(
      err.status ||
        500
    ).json({
      success: false,

      message:
        err.message ||
        "Internal Server Error",
    });
  }
);

// ======================================================
// ================= MONGODB ============================
// ======================================================

mongoose
  .connect(
    process.env
      .MONGO_URI
  )

  .then(() => {

    console.log(
      "MongoDB Connected ✅"
    );

    // ================= START SERVER =================

    server.listen(
      process.env
        .PORT ||
        5000,

      () => {

        console.log(
          `Server running on port ${
            process.env
              .PORT ||
            5000
          } 🚀`
        );
      }
    );
  })

  .catch(
    (err) => {

      console.log(
        "MongoDB Error:",
        err
      );
    }
  );