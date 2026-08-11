import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/logo.png";
import "../styles/Login.css";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      await api.post("forgot-password/", {
        email,
      });

      alert("Password reset link has been sent to your email.");

    } catch (error) {

      alert(
        error.response?.data?.error ||
        "Unable to send reset link."
      );
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

        <h2>Forgot Password</h2>

        <p className="subtitle">
          Enter your registered email address to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">
            Send Reset Link
          </button>

        </form>

        <p className="register-link">
          Remember your password?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default ForgotPassword;