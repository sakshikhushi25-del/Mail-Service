import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMail } from "../context/MailContext";

const Sidebar = () => {
  const { logout } = useAuth();
  const { unreadCount } = useMail();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <i className="fa-solid fa-envelope-open-text"></i>
        <span>Mini Connect</span>
      </div>

      <button
        className="compose-btn"
        onClick={() => navigate("/compose")}
      >
        <i className="fa-solid fa-pen"></i>
        Compose Message
      </button>

      <p className="nav-heading">MAILBOX</p>

      <nav>
        <NavLink to="/" end>
          <i className="fa-solid fa-house"></i>
          Dashboard
        </NavLink>

        <NavLink to="/inbox">
          <i className="fa-solid fa-inbox"></i>
          Inbox
          {unreadCount > 0 && (
            <span className="nav-count">{unreadCount}</span>
          )}
        </NavLink>

        <NavLink to="/sent">
          <i className="fa-solid fa-paper-plane"></i>
          Sent
        </NavLink>

        <NavLink to="/settings">
          <i className="fa-solid fa-gear"></i>
          Settings
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <button onClick={handleLogout}>
          <i className="fa-solid fa-right-from-bracket"></i>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;