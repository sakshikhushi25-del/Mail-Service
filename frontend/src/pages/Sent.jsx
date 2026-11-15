import MessageCard from "../components/MessageCard";
import { useMail } from "../context/MailContext";

const Sent = () => {
  const { sent, deleteMessage } = useMail();

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Sent Messages</h1>
          <p>Messages you have sent to others.</p>
        </div>
      </div>

      <div className="message-list">
        {sent.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            type="sent"
            onDelete={deleteMessage}
          />
        ))}

        {sent.length === 0 && (
          <div className="empty-state">
            <i className="fa-regular fa-paper-plane"></i>
            <h3>No sent messages</h3>
            <p>Your sent messages will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sent;