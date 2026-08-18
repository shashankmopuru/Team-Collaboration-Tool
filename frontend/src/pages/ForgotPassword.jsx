import { useState } from "react";
import { Link } from "react-router-dom";

import {
  FiMail,
  FiArrowLeft,
  FiUsers,
  FiCalendar,
  FiBarChart2,
} from "react-icons/fi";

import api from "../services/api";
import logo from "../assets/logo.png";

import "../styles/ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await api.post("forgot-password/", {
        email,
      });

      setSent(true);
    } catch (error) {
      console.error("Forgot password error:", error);

      alert(
        error.response?.data?.error ||
          error.response?.data?.detail ||
          "Unable to send reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">

      {/* =========================================
          BACKGROUND DECORATIONS
      ========================================== */}

      <div className="background-circle circle1"></div>
      <div className="background-circle circle2"></div>
      <div className="background-wave"></div>


      {/* =========================================
          LEFT PANEL
      ========================================== */}

      <section className="left-panel">

        {/* BRAND */}

        <div className="brand">

          <img
            src={logo}
            alt="Team Sync Logo"
            className="brand-logo"
          />

          <div className="brand-text">

            <h2>TEAM SYNC</h2>

            <span>
              Employee Management System
            </span>

          </div>

        </div>


        {/* HERO */}

        <div className="hero-content">

          <p className="small-heading">
            SECURE ACCOUNT RECOVERY
          </p>

          <h1>
            Get Back
            <br />
            <span>Into Your Account</span>
          </h1>

          <p className="description">
            Don't worry if you've forgotten your password.
            Enter your registered email address and we'll
            help you securely reset your password.
          </p>


          {/* FEATURES */}

          <div className="feature-list">

            <div className="feature-item">

              <div className="feature-icon">
                <FiUsers />
              </div>

              <div className="feature-content">

                <h4>
                  Secure Account Recovery
                </h4>

                <span>
                  Recover your account through your registered email.
                </span>

              </div>

            </div>


            <div className="feature-item">

              <div className="feature-icon">
                <FiCalendar />
              </div>

              <div className="feature-content">

                <h4>
                  Quick & Simple
                </h4>

                <span>
                  Reset your password in just a few steps.
                </span>

              </div>

            </div>


            <div className="feature-item">

              <div className="feature-icon">
                <FiBarChart2 />
              </div>

              <div className="feature-content">

                <h4>
                  Stay Protected
                </h4>

                <span>
                  Keep your Team Sync account secure.
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          RIGHT PANEL
      ========================================== */}

      <section className="right-panel">


        {/* NAVIGATION */}

        <nav className="navbar">

          <ul>

            <li>
              <Link to="/login">
                Home
              </Link>
            </li>

            <li>
              <a href="#contact">
                Contact
              </a>
            </li>

          </ul>

        </nav>


        {/* =====================================
            FORGOT PASSWORD CARD
        ====================================== */}

        <div className="forgot-card">

          {/* LOGO */}

          <div className="forgot-logo-wrapper">

            <img
              src={logo}
              alt="Team Sync Logo"
              className="forgot-logo"
            />

          </div>


          {!sent ? (
            <>
              {/* HEADING */}

              <div className="forgot-heading">

                <h2>
                  Forgot Password?
                </h2>

                <p>
                  Enter your registered email to receive
                  a password reset link.
                </p>

              </div>


              {/* FORM */}

              <form onSubmit={handleSubmit}>

                <div className="forgot-input-container">

                  <FiMail className="forgot-input-icon" />

                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    autoComplete="email"
                    required
                  />

                </div>


                <button
                  type="submit"
                  className="forgot-button"
                  disabled={loading}
                >

                  {loading
                    ? "Sending..."
                    : "Send Reset Link"}

                </button>

              </form>


              {/* BACK TO LOGIN */}

              <p className="forgot-back">

                <Link to="/login">

                  <FiArrowLeft />

                  Back to Login

                </Link>

              </p>
            </>
          ) : (
            /* =================================
               EMAIL SENT MESSAGE
            ================================== */

            <div className="reset-sent">

              <div className="success-icon">
                ✓
              </div>

              <h2>
                Check Your Email
              </h2>

              <p>
                We've sent a password reset link to
                <strong> {email}</strong>.
              </p>

              <p className="reset-note">
                Please check your inbox and follow
                the link to create a new password.
              </p>

              <Link
                to="/login"
                className="forgot-button back-login-button"
              >
                Back to Login
              </Link>

            </div>
          )}

        </div>

      </section>

    </div>
  );
}

export default ForgotPassword;