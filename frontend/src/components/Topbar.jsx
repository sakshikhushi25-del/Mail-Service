import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationPanel from "./NotificationPanel";

const Topbar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const titles = {
    "/": "Dashboard",
    "/inbox": "Inbox",
    "/sent": "Sent Messages",
    "/compose": "Compose Message",
    "/settings": "Settings"
  };

  const title = titles[location.pathname] || "Message Details";

  return (
    <header className="topbar">
      <div>
        <h2>{title}</h2>
        <p>Welcome back, {user?.name}</p>
      </div>

      <div className="topbar-actions">
        <NotificationPanel />

        <div className="user-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Topbar;