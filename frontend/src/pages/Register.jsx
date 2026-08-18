import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiUser,
  FiMail,
  FiLock,
  FiUsers,
  FiCalendar,
  FiBarChart2,
} from "react-icons/fi";

import api from "../services/api";
import logo from "../assets/logo.png";

import "../styles/Register.css";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
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
  // HANDLE REGISTER
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await api.post("register/", formData);

      alert("Registration successful!");

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      alert(
        error.response?.data?.detail ||
          error.response?.data?.error ||
          "Registration failed. Please try again."
      );
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


        {/* HERO CONTENT */}

        <div className="hero-content">

          <p className="small-heading">
            EMPLOYEE MANAGEMENT SIMPLIFIED
          </p>


          <h1>
            Build Your
            <br />
            Team <span>Together</span>
          </h1>


          <p className="description">
            Create your Team Sync account and bring
            your employees, attendance, projects and
            teams together in one secure platform.
          </p>


          {/* FEATURES */}

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
            REGISTER CARD
        ====================================== */}

        <div className="login-card register-card">


          {/* LOGO */}

          <div className="login-logo-wrapper">

            <img
              src={logo}
              alt="Team Sync Logo"
              className="login-logo"
            />

          </div>


          {/* HEADING */}

          <div className="login-heading">

            <h2>
              Create Account
            </h2>

            <p>
              Create your Team Sync account
            </p>

          </div>


          {/* =================================
              REGISTER FORM
          ================================== */}

          <form onSubmit={handleSubmit}>


            {/* USERNAME */}

            <div className="input-container">

              <FiUser className="input-icon" />

              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />

            </div>


            {/* EMAIL */}

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


            {/* PASSWORD */}

            <div className="input-container">

              <FiLock className="input-icon" />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />

            </div>


            {/* REGISTER BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "Create Account"}

            </button>

          </form>


          {/* LOGIN LINK */}

          <p className="register-link">

            Already have an account?{" "}

            <Link to="/login">
              Sign In
            </Link>

          </p>

        </div>

      </section>

    </div>
  );
}

export default Register;