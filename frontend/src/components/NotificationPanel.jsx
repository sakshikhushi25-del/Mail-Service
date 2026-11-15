import { useState } from "react";
import { useMail } from "../context/MailContext";
import { useNavigate } from "react-router-dom";

const NotificationPanel = () => {
  const [open, setOpen] = useState(false);
  const { inbox, unreadCount } = useMail();
  const navigate = useNavigate();

  const unreadMessages = inbox.filter((message) => !message.isRead);

  return (
    <div className="notification-wrapper">
      <button
        className="icon-btn notification-button"
        onClick={() => setOpen(!open)}
      >
        <i className="fa-regular fa-bell"></i>

        {unreadCount > 0 && (
          <span className="notification-dot">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notification-panel">
          <h3>Notifications</h3>

          {unreadMessages.length === 0 ? (
            <p className="empty-text">No new notifications</p>
          ) : (
            unreadMessages.slice(0, 5).map((message) => (
              <div
                className="notification-item"
                key={message.id}
                onClick={() => {
                  setOpen(false);
                  navigate(`/message/${message.id}`);
                }}
              >
                <strong>{message.sender}</strong>
                <p>{message.subject}</p>
              </div>
            ))
          )}

          <button
            className="text-button"
            onClick={() => {
              setOpen(false);
              navigate("/inbox");
            }}
          >
            View Inbox
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;