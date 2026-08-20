import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiUsers,
  FiCalendar,
  FiBarChart2,
} from "react-icons/fi";

import { toast } from "react-toastify";

import api from "../services/api";
import logo from "../assets/logo.png";

import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // =========================
  // HANDLE INPUT CHANGES
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // HANDLE LOGIN
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =========================
    // VALIDATE INPUT
    // =========================

    if (!formData.email || !formData.password) {
      toast.warning(
        "Please enter your email and password."
      );

      return;
    }

    setLoading(true);

    try {
      // =========================
      // LOGIN API
      // =========================

      const response = await api.post(
        "login/",
        formData
      );

      // =========================
      // STORE ACCESS TOKEN
      // =========================

      localStorage.setItem(
        "access",
        response.data.access
      );

      // =========================
      // STORE SESSION ID
      // =========================

      if (response.data.session_id) {
        localStorage.setItem(
          "session_id",
          response.data.session_id
        );
      }

      // =========================
      // GET USER NAME
      // =========================

      const firstName =
        response.data.first_name || "";

      const lastName =
        response.data.last_name || "";

      const username =
        response.data.username || "";

      const fullName =
        `${firstName} ${lastName}`.trim();

      // =========================
      // SUCCESS TOAST
      // =========================

      toast.success(
        `Welcome back, ${
          fullName || username || "User"
        }!`
      );

      // =========================
      // NAVIGATE TO DASHBOARD
      // =========================

      navigate("/dashboard");

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      // =========================
      // ERROR MESSAGE
      // =========================

      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Unable to sign in. Please try again.";

      // =========================
      // ERROR TOAST
      // =========================

      toast.error(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

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

        {/* =====================================
            BRAND
        ====================================== */}

        <div className="brand">

          <img
            src={logo}
            alt="Team Sync Logo"
            className="brand-logo"
          />

          <div className="brand-text">

            <h2>
              TEAM SYNC
            </h2>

            <span>
              Employee Management System
            </span>

          </div>

        </div>


        {/* =====================================
            HERO CONTENT
        ====================================== */}

        <div className="hero-content">

          <p className="small-heading">
            EMPLOYEE MANAGEMENT SIMPLIFIED
          </p>


          <h1>
            Manage Your
            <br />
            Team <span>Efficiently</span>
          </h1>


          <p className="description">
            Team Sync helps organizations manage employees,
            attendance, leave requests, projects and teams
            from one secure platform.
          </p>


          {/* =================================
              FEATURES
          ================================== */}

          <div className="feature-list">

            {/* FEATURE 1 */}

            <div className="feature-item">

              <div className="feature-icon">
                <FiUsers />
              </div>

              <div className="feature-content">

                <h4>
                  Employee Management
                </h4>

                <span>
                  Organize your workforce effortlessly.
                </span>

              </div>

            </div>


            {/* FEATURE 2 */}

            <div className="feature-item">

              <div className="feature-icon">
                <FiCalendar />
              </div>

              <div className="feature-content">

                <h4>
                  Attendance & Leave
                </h4>

                <span>
                  Track attendance and leave records.
                </span>

              </div>

            </div>


            {/* FEATURE 3 */}

            <div className="feature-item">

              <div className="feature-icon">
                <FiBarChart2 />
              </div>

              <div className="feature-content">

                <h4>
                  Analytics & Reports
                </h4>

                <span>
                  Gain insights with beautiful dashboards.
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


        {/* =====================================
            TOP NAVIGATION
        ====================================== */}

        <nav className="navbar">

          <ul>

            <li>

              <Link to="/">
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
            LOGIN CARD
        ====================================== */}

        <div className="login-card">


          {/* =================================
              LOGIN LOGO
          ================================== */}

          <div className="login-logo-wrapper">

            <img
              src={logo}
              alt="Team Sync Logo"
              className="login-logo"
            />

          </div>


          {/* =================================
              LOGIN HEADING
          ================================== */}

          <div className="login-heading">

            <h2>
              Welcome Back!
            </h2>

            <p>
              Sign in to your Team Sync account
            </p>

          </div>


          {/* =================================
              LOGIN FORM
          ================================== */}

          <form onSubmit={handleSubmit}>


            {/* =================================
                EMAIL
            ================================== */}

            <div className="input-container">

              <FiMail className="input-icon" />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />

            </div>


            {/* =================================
                PASSWORD
            ================================== */}

            <div className="input-container">

              <FiLock className="input-icon" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />


              {/* SHOW EYE ONLY WHEN USER TYPES */}

              {formData.password.length > 0 && (

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}

                </button>

              )}

            </div>


            {/* =================================
                REMEMBER ME / FORGOT PASSWORD
            ================================== */}

            <div className="login-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                  name="remember"
                />

                <span>
                  Remember Me
                </span>

              </label>


              <Link to="/forgot-password">
                Forgot Password?
              </Link>

            </div>


            {/* =================================
                LOGIN BUTTON
            ================================== */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading
                ? "Signing In..."
                : "Sign In"}

            </button>

          </form>


          {/* =================================
              REGISTER LINK
          ================================== */}

          <p className="register-link">

            Don't have an account?{" "}

            <Link to="/register">
              Create an account
            </Link>

          </p>

        </div>

      </section>

    </div>
  );
}

export default Login;