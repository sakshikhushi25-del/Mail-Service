import { useNavigate } from "react-router-dom";
import { useMail } from "../context/MailContext";

const Dashboard = () => {
  const { inbox, sent, unreadCount } = useMail();
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Received",
      value: inbox.length,
      icon: "fa-inbox"
    },
    {
      title: "Sent Messages",
      value: sent.length,
      icon: "fa-paper-plane"
    },
    {
      title: "Unread Messages",
      value: unreadCount,
      icon: "fa-envelope"
    }
  ];

  return (
    <div className="dashboard">
      <div className="welcome-section">
        <div>
          <h1>Your Communication Space</h1>
          <p>Manage your messages and stay connected.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => navigate("/compose")}
        >
          <i className="fa-solid fa-pen"></i> Compose Message
        </button>
      </div>

      <div className="stats-grid">
        {stats.map((item) => (
          <div className="stat-card" key={item.title}>
            <div className="stat-icon">
              <i className={`fa-solid ${item.icon}`}></i>
            </div>

            <p>{item.title}</p>
            <h2>{item.value}</h2>
          </div>
        ))}
      </div>

      <div className="section-header">
        <h2>Recent Messages</h2>

        <button
          className="text-button"
          onClick={() => navigate("/inbox")}
        >
          View All
        </button>
      </div>

      <div className="recent-list">
        {inbox.slice(0, 5).map((message) => (
          <div
            className="recent-message"
            key={message.id}
            onClick={() => navigate(`/message/${message.id}`)}
          >
            <div className="message-avatar">
              {message.sender.charAt(0)}
            </div>

            <div className="recent-message-info">
              <strong>{message.sender}</strong>
              <p>{message.subject}</p>
            </div>

            {!message.isRead && <span className="unread-dot"></span>}
          </div>
        ))}

        {inbox.length === 0 && (
          <p className="empty-text">No messages received yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;