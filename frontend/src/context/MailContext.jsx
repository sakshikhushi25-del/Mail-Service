import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { useAuth } from "./AuthContext";
import api from "../services/api";

const MailContext = createContext();

const formatMessage = (message) => ({
  ...message,
  id: message._id || message.id,
  sender: message.senderEmail,
  date: message.createdAt || message.date
});

export const MailProvider = ({ children }) => {
  const { user } = useAuth();

  const [inbox, setInbox] = useState([]);
  const [sent, setSent] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    if (!user) {
      setInbox([]);
      setSent([]);
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [inboxResponse, sentResponse] = await Promise.all([
        api.get("/messages/inbox"),
        api.get("/messages/sent")
      ]);

      const inboxMessages = (
        inboxResponse.data.data || []
      ).map(formatMessage);

      const sentMessages = (
        sentResponse.data.data || []
      ).map(formatMessage);

      setInbox(inboxMessages);
      setSent(sentMessages);

      setUnreadCount(
        inboxMessages.filter((message) => !message.isRead).length
      );

    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Unable to load messages."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user?.id]);

  const sendMessage = async (receiverEmail, subject, body) => {
    try {
      const response = await api.post("/messages", {
        receiverEmail,
        subject,
        body
      });

      const newMessage = formatMessage(response.data.data);

      setSent((previous) => [
        newMessage,
        ...previous
      ]);

      return {
        success: true,
        message: response.data.message
      };

    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to send message."
      };
    }
  };

  const markAsRead = async (id) => {
    try {
      const existingMessage = inbox.find(
        (message) => message.id === id
      );

      if (!existingMessage) {
        return {
          success: false,
          message: "Message not found."
        };
      }

      if (existingMessage.isRead) {
        return { success: true };
      }

      await api.patch(`/messages/${id}/read`);

      setInbox((previous) =>
        previous.map((message) =>
          message.id === id
            ? { ...message, isRead: true }
            : message
        )
      );

      setUnreadCount((previous) =>
        Math.max(0, previous - 1)
      );

      return { success: true };

    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to update message."
      };
    }
  };

  // Delete message
  const deleteMessage = async (id, type) => {
    try {
      await api.delete(`/messages/${id}`);

      if (type === "inbox") {
        setInbox((previous) =>
          previous.filter((message) => message.id !== id)
        );
      } else {
        setSent((previous) =>
          previous.filter((message) => message.id !== id)
        );
      }

      // Recalculate unread count
      if (type === "inbox") {
        const remainingUnread = inbox.filter(
          (message) => message.id !== id && !message.isRead
        ).length;

        setUnreadCount(remainingUnread);
      }

      return { success: true };

    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to delete message."
      };
    }
  };

  return (
    <MailContext.Provider
      value={{
        inbox,
        sent,
        unreadCount,
        loading,
        error,
        fetchMessages,
        sendMessage,
        markAsRead,
        deleteMessage
      }}
    >
      {children}
    </MailContext.Provider>
  );
};

export const useMail = () => useContext(MailContext);