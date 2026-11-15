
import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  sendMessage,
  getInbox,
  getSentMessages,
  getMessageById,
  markAsRead,
  getUnreadCount,
  deleteMessage
} from "../controllers/messageController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", sendMessage);
router.get("/inbox", getInbox);
router.get("/sent", getSentMessages);
router.get("/unread-count", getUnreadCount);
router.get("/:id", getMessageById);
router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteMessage);

export default router;