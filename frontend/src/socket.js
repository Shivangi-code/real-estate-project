import { io } from "socket.io-client";

// ======================================================
// ================= SOCKET URL =========================
// ======================================================
console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);
console.log("MODE =", import.meta.env.MODE);
const SOCKET_URL =

  import.meta.env.VITE_API_URL ||

  "http://localhost:5000";

// ======================================================
// ================= SOCKET INSTANCE ====================
// ======================================================

const socket = io(

  SOCKET_URL,

  {

    // ======================================================
    // ================= CONNECTION =========================
    // ======================================================

    autoConnect: true,

    withCredentials: true,

    transports: [

      "websocket",

      "polling",
    ],

    // ======================================================
    // ================= RECONNECTION =======================
    // ======================================================

    reconnection: true,

    reconnectionAttempts: Infinity,

    reconnectionDelay: 1000,

    reconnectionDelayMax: 5000,

    timeout: 20000,
  }
);

// ======================================================
// ================= CONNECTION EVENTS ==================
// ======================================================

// ================= CONNECT =================

socket.on(

  "connect",

  () => {

    console.log(

      "⚡ Socket Connected:",

      socket.id
    );

    // ======================================================
    // ================= SAFE USER ==========================
    // ======================================================

    try {

      const user = JSON.parse(

        localStorage.getItem(
          "user"
        ) || "{}"
      );

      // ======================================================
      // ================= REGISTER USER ======================
      // ======================================================

      if (
        user?._id
      ) {

        socket.emit(

          "registerUser",

          {

            userId:
              user._id,

            role:
              user.role ||
              "user",
          }
        );

        // ======================================================
        // ================= OWNER ROOM =========================
        // ======================================================

        socket.emit(

          "joinOwnerRoom",

          user._id
        );

        // ======================================================
        // ================= ADMIN ROOM =========================
        // ======================================================

        if (
          user.role ===
          "admin"
        ) {

          socket.emit(
            "joinAdminRoom"
          );
        }

        console.log(

          `✅ Socket Registered: ${user.role}`
        );
      }

    } catch (
      error
    ) {

      console.log(

        "Socket User Parse Error ❌",

        error
      );
    }
  }
);

// ================= DISCONNECT =================

socket.on(

  "disconnect",

  (
    reason
  ) => {

    console.log(

      "❌ Socket Disconnected:",

      reason
    );
  }
);

// ================= RECONNECT =================

socket.on(

  "reconnect",

  (
    attempt
  ) => {

    console.log(

      `🔄 Socket Reconnected (${attempt})`
    );
  }
);

// ================= CONNECT ERROR =================

socket.on(

  "connect_error",

  (
    error
  ) => {

    console.log(

      "Socket Connection Error ❌",

      error.message
    );
  }
);

// ======================================================
// ================= MODERATION EVENTS ==================
// ======================================================

// ================= PROPERTY UPDATED =================

socket.on(

  "propertyUpdated",

  (
    data
  ) => {

    console.log(

      "🏠 Property Updated:",

      data
    );
  }
);

// ================= MODERATION NOTIFICATION ===========

socket.on(

  "moderationNotification",

  (
    notification
  ) => {

    console.log(

      "🔔 Moderation Notification:",

      notification
    );
  }
);

// ================= MODERATION ACTIVITY ===============

socket.on(

  "moderationActivity",

  (
    activity
  ) => {

    console.log(

      "📋 Moderation Activity:",

      activity
    );
  }
);

// ======================================================
// ================= SOCKET HELPERS =====================
// ======================================================

// ================= MANUAL CONNECT =================

export const connectSocket =
  () => {

    if (
      !socket.connected
    ) {

      socket.connect();
    }
  };

// ================= MANUAL DISCONNECT ==============

export const disconnectSocket =
  () => {

    if (
      socket.connected
    ) {

      socket.disconnect();
    }
  };

// ================= CHECK CONNECTION ===============

export const isSocketConnected =
  () => {

    return socket.connected;
  };

// ======================================================
// ================= EXPORT =============================
// ======================================================

export default socket;