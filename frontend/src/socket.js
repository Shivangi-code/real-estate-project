import { io } from "socket.io-client";

// ✅ GLOBAL SOCKET CONNECTION
const socket = io(
  "http://localhost:5000",
  {
    transports: ["websocket"],
    withCredentials: true,
  }
);

export default socket;