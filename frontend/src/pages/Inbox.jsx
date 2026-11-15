import MessageCard from "../components/MessageCard";
import { useMail } from "../context/MailContext";

const Inbox = () => {
  const { inbox, deleteMessage, unreadCount } = useMail();

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Inbox</h1>
          <p>You have {unreadCount} unread messages.</p>
        </div>
      </div>

      <div className="message-list">
        {inbox.map((message) => (
          <MessageCard
            key={message.id}
            message={message}
            type="inbox"
            onDelete={deleteMessage}
          />
        ))}

        {inbox.length === 0 && (
          <div className="empty-state">
            <i className="fa-regular fa-envelope-open"></i>
            <h3>Your inbox is empty</h3>
            <p>New messages will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;