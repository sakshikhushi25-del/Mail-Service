import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const onlineUsers = new Map();

const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"]
    }
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      socket.userId = decoded.userId;

      next();
    } catch (error) {
      next(new Error("Invalid socket token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId.toString();

    socket.join(`user:${userId}`);

    onlineUsers.set(
      userId,
      (onlineUsers.get(userId) || 0) + 1
    );

    console.log("User connected:", userId);

    io.emit("online-users", [...onlineUsers.keys()]);

    socket.on("disconnect", () => {
      const count = onlineUsers.get(userId) || 0;

      if (count <= 1) {
        onlineUsers.delete(userId);
      } else {
        onlineUsers.set(userId, count - 1);
      }

      io.emit("online-users", [...onlineUsers.keys()]);

      console.log("User disconnected:", userId);
    });
  });

  return io;
};

export default initializeSocket;