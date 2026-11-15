import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    senderEmail: {
      type: String,
      required: true
    },

    receiverEmail: {
      type: String,
      required: true
    },

    subject: {
      type: String,
      required: true
    },

    body: {
      type: String,
      required: true
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;