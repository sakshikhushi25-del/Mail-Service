import { Routes, Route, Navigate } from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Inbox from "./pages/Inbox";
import Sent from "./pages/Sent";
import Compose from "./pages/Compose";
import MessageDetails from "./pages/MessageDetails";
import Settings from "./pages/Settings";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />

      <Route
        path="/register"
        element={user ? <Navigate to="/" replace /> : <Register />}
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/sent" element={<Sent />} />
        <Route path="/compose" element={<Compose />} />
        <Route path="/message/:id" element={<MessageDetails />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;