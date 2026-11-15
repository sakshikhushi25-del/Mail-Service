import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { useMail } from "../context/MailContext";
import VoiceControls from "../components/VoiceControls";

const MessageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { inbox, sent, markAsRead } = useMail();

  const message = [...inbox, ...sent].find(
    (item) => item.id === id
  );

  useEffect(() => {
    if (message && inbox.some((item) => item.id === id)) {
      markAsRead(id);
    }
  }, [id, message]);

  if (!message) {
    return (
      <div className="empty-state">
        <h3>Message not found</h3>
        <button className="primary-btn" onClick={() => navigate("/inbox")}>
          Back to Inbox
        </button>
      </div>
    );
  }

  const speechText = `
    Message from ${message.sender}.
    Subject: ${message.subject}.
    ${message.body}
  `;

  return (
    <div className="details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <i className="fa-solid fa-arrow-left"></i> Back
      </button>

      <div className="details-card">
        <div className="details-header">
          <h1>{message.subject}</h1>
          <span className="status-badge">Message</span>
        </div>

        <div className="sender-details">
          <div className="message-avatar">
            {message.sender.charAt(0)}
          </div>

          <div>
            <strong>{message.sender}</strong>
            <p>{message.senderEmail}</p>
            <small>{new Date(message.date).toLocaleString()}</small>
          </div>
        </div>

        <div className="message-body">
          {message.body}
        </div>

        <div className="voice-section">
          <div>
            <h3>
              <i className="fa-solid fa-volume-high"></i> Voice Assistant
            </h3>
            <p>Listen to this complete message.</p>
          </div>

          <VoiceControls text={speechText} />
        </div>
      </div>
    </div>
  );
};

export default MessageDetails;