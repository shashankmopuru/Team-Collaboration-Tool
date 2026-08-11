import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/logo.png";
import "../styles/Login.css";

function ResetPassword() {
  const navigate = useNavigate();

  const { uid, token } = useParams();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await api.post("reset-password/", {
        uid,
        token,
        password: formData.password,
      });

      alert("Password reset successful!");

      navigate("/login");

    } catch (error) {
      alert("Reset link is invalid or has expired.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <img
          src={logo}
          alt="Team Sync Logo"
          className="login-logo"
        />

        <h2>Reset Password</h2>

        <p className="subtitle">
          Create a new password for your Team Sync account
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="password"
            name="password"
            placeholder="New Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Reset Password
          </button>

        </form>

        <p className="register-link">
          Back to{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default ResetPassword;