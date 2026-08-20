import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiBriefcase,
  FiMapPin,
  FiSave,
} from "react-icons/fi";

import logo from "../assets/logo.png";

import "../styles/AddEmployee.css";

function AddEmployee() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "employee",
    department: "",
    designation: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = (e) => {
    e.preventDefault();

    /*
      BACKEND API WILL BE CONNECTED LATER.

      For now, we only handle the frontend form.
    */

    console.log("Employee data:", formData);

    alert("Employee form submitted successfully.");

    navigate("/members");
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {
    navigate("/members");
  };

  return (
    <div className="add-employee-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="add-employee-header">

        <div className="add-employee-brand">

          <div className="add-employee-logo-wrapper">
            <img
              src={logo}
              alt="Team Sync"
              className="add-employee-logo"
            />
          </div>

          <div className="add-employee-brand-text">

            <h2>TEAM SYNC</h2>

            <span>
              Employee Management
            </span>

          </div>

        </div>

        <Link
          to="/members"
          className="back-members-link"
        >
          <FiArrowLeft />
          Back to Members
        </Link>

      </header>


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="add-employee-content">

        {/* PAGE HEADER */}

        <div className="add-employee-page-header">

          <div>

            <span className="add-employee-eyebrow">
              EMPLOYEE MANAGEMENT
            </span>

            <h1>
              Add Employee
            </h1>

            <p>
              Add a new employee to your Team Sync
              organization.
            </p>

          </div>

        </div>


        {/* =================================================
            FORM CARD
        ================================================= */}

        <form
          className="add-employee-card"
          onSubmit={handleSubmit}
        >

          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <section className="form-section">

            <div className="form-section-heading">

              <div className="section-icon">
                <FiUser />
              </div>

              <div>
                <h3>
                  Personal Information
                </h3>

                <p>
                  Enter the employee's basic information.
                </p>
              </div>

            </div>


            <div className="form-grid">

              {/* FIRST NAME */}

              <div className="form-field">

                <label htmlFor="firstName">
                  First Name
                  <span>*</span>
                </label>

                <div className="form-input-wrapper">

                  <FiUser />

                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* LAST NAME */}

              <div className="form-field">

                <label htmlFor="lastName">
                  Last Name
                  <span>*</span>
                </label>

                <div className="form-input-wrapper">

                  <FiUser />

                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="form-field">

                <label htmlFor="email">
                  Email Address
                  <span>*</span>
                </label>

                <div className="form-input-wrapper">

                  <FiMail />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="employee@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* PHONE */}

              <div className="form-field">

                <label htmlFor="phone">
                  Phone Number
                </label>

                <div className="form-input-wrapper">

                  <FiPhone />

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="form-field full-width">

                <label htmlFor="password">
                  Temporary Password
                  <span>*</span>
                </label>

                <div className="form-input-wrapper">

                  <FiLock />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Create temporary password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="password-show-button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>

                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              WORK INFORMATION
          ================================================= */}

          <section className="form-section">

            <div className="form-section-heading">

              <div className="section-icon">
                <FiBriefcase />
              </div>

              <div>

                <h3>
                  Work Information
                </h3>

                <p>
                  Define the employee's role and department.
                </p>

              </div>

            </div>


            <div className="form-grid">

              {/* ROLE */}

              <div className="form-field">

                <label htmlFor="role">
                  Role
                  <span>*</span>
                </label>

                <div className="form-input-wrapper">

                  <FiBriefcase />

                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >

                    <option value="employee">
                      Employee
                    </option>

                    <option value="manager">
                      Manager
                    </option>

                    <option value="admin">
                      Admin
                    </option>

                  </select>

                </div>

              </div>


              {/* DEPARTMENT */}

              <div className="form-field">

                <label htmlFor="department">
                  Department
                </label>

                <div className="form-input-wrapper">

                  <FiMapPin />

                  <input
                    id="department"
                    type="text"
                    name="department"
                    placeholder="e.g. Engineering"
                    value={formData.department}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* DESIGNATION */}

              <div className="form-field">

                <label htmlFor="designation">
                  Designation
                </label>

                <div className="form-input-wrapper">

                  <FiBriefcase />

                  <input
                    id="designation"
                    type="text"
                    name="designation"
                    placeholder="e.g. Software Engineer"
                    value={formData.designation}
                    onChange={handleChange}
                  />

                </div>

              </div>

            </div>

          </section>


          {/* =================================================
              FORM ACTIONS
          ================================================= */}

          <div className="add-employee-actions">

            <button
              type="button"
              className="cancel-employee-button"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-employee-button"
            >
              <FiSave />
              Add Employee
            </button>

          </div>

        </form>

      </main>

    </div>
  );
}

export default AddEmployee;