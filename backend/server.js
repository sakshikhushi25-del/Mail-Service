import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import initializeSocket from "./socket/socket.js";

import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();

const server = http.createServer(app);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL
  })
);

app.use(express.json());

// Database
await connectDB();

// Socket.IO
const io = initializeSocket(server);

app.set("io", io);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Health check
app.get("/", (req, res) => {
  res.redirect("http://localhost:5173/login");
});

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});