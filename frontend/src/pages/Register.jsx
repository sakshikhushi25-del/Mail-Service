
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    const result = await register(
      form.name,
      form.email,
      form.password
    );

    setLoading(false);

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-logo">
          <i className="fa-solid fa-envelope-open-text"></i>
        </div>

        <h1>Create Account</h1>
        <p>Join Mini Connect today.</p>

        {error && <div className="error-message">{error}</div>}

        <label>Full Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          required
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <label>Email Address</label>
        <input
          type="email"
          placeholder="Enter your email"
          required
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Minimum 8 characters"
          required
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm your password"
          required
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />

        <button
          type="submit"
          className="primary-btn"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="auth-footer">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;