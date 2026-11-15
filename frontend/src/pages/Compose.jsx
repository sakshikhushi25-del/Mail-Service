import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMail } from "../context/MailContext";

const Compose = () => {
  const { sendMessage } = useMail();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    receiverEmail: "",
    subject: "",
    body: ""
  });

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.body.trim()) {
      setError("Please write a message.");
      return;
    }

    sendMessage(
      form.receiverEmail.trim().toLowerCase(),
      form.subject.trim(),
      form.body.trim()
    );

    navigate("/sent");
  };

  return (
    <div className="compose-container">
      <h1>Compose Message</h1>
      <p>Write and send a message to another user.</p>

      <form className="compose-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <label>Recipient Email</label>
        <input
          type="email"
          placeholder="Enter recipient email"
          required
          value={form.receiverEmail}
          onChange={(e) =>
            setForm({ ...form, receiverEmail: e.target.value })
          }
        />

        <label>Subject</label>
        <input
          type="text"
          placeholder="Enter subject"
          required
          value={form.subject}
          onChange={(e) =>
            setForm({ ...form, subject: e.target.value })
          }
        />

        <label>Message</label>
        <textarea
          rows="10"
          placeholder="Write your message here..."
          required
          value={form.body}
          onChange={(e) =>
            setForm({ ...form, body: e.target.value })
          }
        />

        <div className="compose-actions">
          <button type="button" className="secondary-btn" onClick={() => navigate("/inbox")}>
            Cancel
          </button>

          <button className="primary-btn">
            <i className="fa-solid fa-paper-plane"></i> Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default Compose;