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
          process.env
            .CLIENT_URL ||

          "http://localhost:5173",

        credentials: true,
      },

      transports: [

        "websocket",

        "polling",
      ],
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
// ================= ACTIVE USERS =======================
// ======================================================

const activeUsers =
  new Map();

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

    // ======================================================
    // ================= REGISTER USER ======================
    // ======================================================

    socket.on(

      "registerUser",

      (
        userData
      ) => {

        try {

          if (
            !userData?.userId
          ) {

            return;
          }

          activeUsers.set(

            userData.userId,

            {

              socketId:
                socket.id,

              role:
                userData.role ||

                "user",

              connectedAt:
                new Date(),
            }
          );

          console.log(

            `✅ Registered User: ${userData.userId}`
          );

        } catch (
          error
        ) {

          console.log(

            "Socket Register Error:",

            error
          );
        }
      }
    );

    // ======================================================
    // ================= JOIN ADMIN ROOM ====================
    // ======================================================

    socket.on(

      "joinAdminRoom",

      () => {

        socket.join(
          "admin-room"
        );

        console.log(

          `👑 Admin Joined: ${socket.id}`
        );
      }
    );

    // ======================================================
    // ================= JOIN OWNER ROOM ====================
    // ======================================================

    socket.on(

      "joinOwnerRoom",

      (
        ownerId
      ) => {

        if (
          !ownerId
        ) {

          return;
        }

        socket.join(
          `owner-${ownerId}`
        );

        console.log(

          `🏠 Owner Joined Room: owner-${ownerId}`
        );
      }
    );

    // ======================================================
    // ================= TYPING / LIVE EVENTS ===============
    // ======================================================

    socket.on(

      "moderationTyping",

      (
        data
      ) => {

        socket
          .to(
            "admin-room"
          )

          .emit(

            "moderationTyping",

            data
          );
      }
    );

    // ======================================================
    // ================= DISCONNECT =========================
    // ======================================================

    socket.on(

      "disconnect",

      () => {

        console.log(

          "❌ User Disconnected:",

          socket.id
        );

        // REMOVE USER
        for (const [

          userId,

          userData,

        ] of activeUsers.entries()) {

          if (
            userData.socketId ===
            socket.id
          ) {

            activeUsers.delete(
              userId
            );

            console.log(

              `🗑 Removed User: ${userId}`
            );

            break;
          }
        }
      }
    );
  }
);

// ======================================================
// ================= SOCKET HELPERS =====================
// ======================================================

app.set(

  "sendModerationNotification",

  ({
    ownerId,
    notification,
  }) => {

    try {

      if (
        !ownerId
      ) {

        return;
      }

      // ======================================================
      // ================= OWNER ROOM EVENT ===================
      // ======================================================

      io.to(

        `owner-${ownerId}`

      ).emit(

        "moderationNotification",

        notification
      );

      // ======================================================
      // ================= GLOBAL PROPERTY UPDATE =============
      // ======================================================

      io.emit(

        "propertyUpdated",

        {

          ownerId,

          ...notification,
        }
      );

      console.log(

        `📢 Notification Sent To Owner: ${ownerId}`
      );

    } catch (
      error
    ) {

      console.log(

        "Socket Notification Error:",

        error
      );
    }
  }
);

// ======================================================
// ================= RATE LIMITERS ======================
// ======================================================

// ======================================================
// ================= GLOBAL LIMIT =======================
// ======================================================

const globalLimiter =
  rateLimit({

    windowMs:
      15 *
      60 *
      1000,

    max:
      process.env
        .NODE_ENV ===
      "production"

        ? 500

        : 1000,

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

// ======================================================
// ================= AUTH LIMIT =========================
// ======================================================

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

// ======================================================
// ================= GLOBAL RATE LIMIT ==================
// ======================================================

app.use(
  globalLimiter
);

// ======================================================
// ================= CORS ===============================
// ======================================================

app.use(

  cors({

    origin:
      process.env
        .CLIENT_URL ||

      "http://localhost:5173",

    credentials: true,
  })
);

// ======================================================
// ================= BODY PARSERS =======================
// ======================================================

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
// ================= STATIC FILES =======================
// ======================================================

app.use(

  "/uploads",

  express.static(
    "uploads"
  )
);

// ======================================================
// ================= API ROUTES =========================
// ======================================================

// ======================================================
// ================= AUTH ===============================
// ======================================================

app.use(

  "/api/user-auth",

  authLimiter,

  require(
    "./routes/userAuthRoutes"
  )
);

// ======================================================
// ================= PROPERTIES =========================
// ======================================================

app.use(

  "/api/properties",

  require(
    "./routes/propertyRoutes"
  )
);

// ======================================================
// ================= ADMIN ==============================
// ======================================================

app.use(

  "/api/admin",

  require(
    "./routes/adminRoutes"
  )
);

// ======================================================
// ================= LEADS ==============================
// ======================================================

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

      socket:
        "connected",

      timestamp:
        new Date(),
    });
  }
);

// ======================================================
// ================= SOCKET STATUS ======================
// ======================================================

app.get(

  "/api/socket-status",

  (
    req,
    res
  ) => {

    res.json({

      success: true,

      connectedUsers:
        activeUsers.size,

      users:
        Array.from(

          activeUsers.keys()
        ),
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

    // ======================================================
    // ================= START SERVER =======================
    // ======================================================

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

        console.log(
          "Socket.IO Enabled ✅"
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