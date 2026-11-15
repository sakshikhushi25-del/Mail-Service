
import { useNavigate } from "react-router-dom";

const MessageCard = ({ message, type, onDelete }) => {
  const navigate = useNavigate();

  // Check whether message exists
  if (!message) {
    return null;
  }

  const person =
    type === "inbox"
      ? message.senderEmail || message.sender || "Unknown sender"
      : message.receiverEmail || "Unknown receiver";

  return (
    <div
      className={`message-card ${
        !message.isRead && type === "inbox" ? "unread" : ""
      }`}
    >
      <div
        className="message-info"
        onClick={() => navigate(`/message/${message.id}`)}
      >
        <div className="message-avatar">
          {person.charAt(0).toUpperCase()}
        </div>

        <div className="message-text">
          <strong>{person}</strong>
          <h4>{message.subject}</h4>
          <p>{message.body}</p>
        </div>
      </div>

      <div className="message-actions">
        <span>
          {message.date
            ? new Date(message.date).toLocaleDateString()
            : ""}
        </span>

        <button
          className="delete-btn"
          onClick={() => onDelete?.(message.id, type)}
          title="Delete message"
        >
          <i className="fa-regular fa-trash-can"></i>
        </button>
      </div>
    </div>
  );
};

export default MessageCard;