
import Message from "../models/Message.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

// SEND MESSAGE
export const sendMessage = async (req, res) => {
  try {
    const { receiverEmail, subject, body } = req.body;

    if (!receiverEmail?.trim() || !subject?.trim() || !body?.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }

    const receiver = await User.findOne({
      email: receiverEmail.trim().toLowerCase()
    });

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Recipient is not registered."
      });
    }

    if (receiver._id.equals(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a message to yourself."
      });
    }

    // Save message in MongoDB
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiver._id,
      senderEmail: req.user.email,
      receiverEmail: receiver.email,
      subject: subject.trim(),
      body: body.trim()
    });

    const populatedMessage = {
      ...message.toObject(),
      id: message._id.toString()
    };

    // Send real-time notification
    const io = req.app.get("io");

    if (io) {
      io.to(`user:${receiver._id}`).emit(
        "new-message",
        populatedMessage
      );
    }

    // Send email alert
    try {
      await sendEmail(
        receiver.email,
        subject.trim(),
        req.user.name
      );
    } catch (emailError) {
      console.error(
        "Email sending failed:",
        emailError.message
      );
    }

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: populatedMessage
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET INBOX
export const getInbox = async (req, res) => {
  try {
    const messages = await Message.find({
      receiver: req.user._id
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: messages
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET SENT MESSAGES
export const getSentMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      sender: req.user._id
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: messages
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET ONE MESSAGE
export const getMessageById = async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: req.params.id,
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found."
      });
    }

    return res.status(200).json({
      success: true,
      data: message
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// MARK MESSAGE AS READ
export const markAsRead = async (req, res) => {
  try {
    const message = await Message.findOneAndUpdate(
      {
        _id: req.params.id,
        receiver: req.user._id
      },
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message marked as read.",
      data: message
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET UNREAD COUNT
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false
    });

    return res.status(200).json({
      success: true,
      count
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// DELETE MESSAGE
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findOneAndDelete({
      _id: req.params.id,
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully."
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};