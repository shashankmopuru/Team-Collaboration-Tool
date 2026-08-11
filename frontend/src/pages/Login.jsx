import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import logo from "../assets/logo.png";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("login/", formData);

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      alert("Login Successful!");

      navigate("/dashboard");
    } catch (error) {
      alert("Invalid Email or Password");
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

        <h2>Welcome Back</h2>

        <p className="subtitle">
          Login to Team Sync
        </p>

        <form onSubmit={handleSubmit}>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="login-options">

            <label>
              <input type="checkbox" />
              {" "}Remember Me
            </label>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>

          </div>

          <button type="submit">
            Login
          </button>

        </form>

        <p className="register-link">
          Don't have an account?
          <Link to="/register"> Register</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;