import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiSearch,
  FiPlus,
  FiBell,
  FiChevronDown,
  FiUsers,
  FiHome,
  FiFolder,
  FiCheckSquare,
  FiCalendar,
  FiFileText,
  FiVolume2,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiLock,
  FiHelpCircle,
  FiLogOut,
  FiMoreVertical,
  FiUserCheck,
  FiBriefcase,
  FiShield,
} from "react-icons/fi";

import api from "../services/api";
import logo from "../assets/logo.png";

import "../styles/Dashboard.css";
import "../styles/Members.css";


function Members() {

  const navigate = useNavigate();

  /* =====================================================
     EMPLOYEES
     ===================================================== */

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);


  /* =====================================================
     FILTERS
     ===================================================== */

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");


  /* =====================================================
     ACTION MENU
     ===================================================== */

  const [openMenu, setOpenMenu] = useState(null);


  /* =====================================================
     PROFILE
     ===================================================== */

  const [profile, setProfile] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);


  /* =====================================================
     FETCH EMPLOYEES
     ===================================================== */

  const fetchEmployees = async () => {

    try {

      setLoading(true);

      const response = await api.get("employees/");

      setEmployees(response.data);

    } catch (error) {

      console.error(
        "Failed to load employees:",
        error
      );

      if (error.response?.status === 401) {

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        navigate("/login");
      }

    } finally {

      setLoading(false);

    }

  };


  /* =====================================================
     FETCH PROFILE
     ===================================================== */

  const fetchProfile = async () => {

    try {

      const response = await api.get("profile/");

      setProfile(response.data);

    } catch (error) {

      console.error(
        "Failed to load profile:",
        error
      );

      if (error.response?.status === 401) {

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        navigate("/login");
      }

    }

  };


  useEffect(() => {

    fetchEmployees();
    fetchProfile();

  }, []);


  /* =====================================================
     CLOSE ACTION MENU
     ===================================================== */

  useEffect(() => {

    const handleClickOutside = () => {
      setOpenMenu(null);
    };

    document.addEventListener(
      "click",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "click",
        handleClickOutside
      );

    };

  }, []);


  /* =====================================================
     PROFILE DATA
     ===================================================== */

  const firstName =
    profile?.first_name ||
    profile?.username ||
    "User";

  const fullName =
    [profile?.first_name, profile?.last_name]
      .filter(Boolean)
      .join(" ") ||
    profile?.username ||
    "User";

  const email =
    profile?.email || "";

  const role =
    profile?.profile?.role || "employee";

  const displayRole =
    role.charAt(0).toUpperCase() +
    role.slice(1);

  const avatarLetter = (
    profile?.first_name?.charAt(0) ||
    profile?.username?.charAt(0) ||
    "U"
  ).toUpperCase();


  /* =====================================================
     LOGOUT
     ===================================================== */

  const handleLogout = () => {

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/login");

  };


  /* =====================================================
     STATISTICS
     ===================================================== */

  const totalMembers =
    employees.length;

  const activeMembers =
    employees.filter(
      (employee) =>
        employee.is_active !== false
    ).length;

  const managers =
    employees.filter(
      (employee) =>
        employee.role === "manager"
    ).length;

  const admins =
    employees.filter(
      (employee) =>
        employee.role === "admin"
    ).length;


  /* =====================================================
     FILTER EMPLOYEES
     ===================================================== */

  const filteredEmployees =
    employees.filter((employee) => {

      const searchValue =
        search.toLowerCase();

      const employeeName =
        `${employee.first_name || ""} ${
          employee.last_name || ""
        }`.toLowerCase();

      const username =
        employee.username
          ?.toLowerCase() || "";

      const employeeEmail =
        employee.email
          ?.toLowerCase() || "";

      const department =
        employee.department
          ?.toLowerCase() || "";


      const matchesSearch =
        employeeName.includes(searchValue) ||
        username.includes(searchValue) ||
        employeeEmail.includes(searchValue) ||
        department.includes(searchValue);


      const matchesRole =
        roleFilter === "all" ||
        employee.role === roleFilter;


      const employeeActive =
        employee.is_active !== false;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" &&
          employeeActive) ||
        (statusFilter === "inactive" &&
          !employeeActive);


      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );

    });


  /* =====================================================
     EMPLOYEE INITIAL
     ===================================================== */

  const getInitial = (employee) => {

    return (
      employee.first_name?.charAt(0) ||
      employee.username?.charAt(0) ||
      "U"
    ).toUpperCase();

  };


  /* =====================================================
     FORMAT DATE
     ===================================================== */

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  /* =====================================================
     OPEN EMPLOYEE MENU
     ===================================================== */

  const handleMenuClick = (
    event,
    employeeId
  ) => {

    event.stopPropagation();

    setOpenMenu(
      openMenu === employeeId
        ? null
        : employeeId
    );

  };


  /* =====================================================
     VIEW EMPLOYEE
     ===================================================== */

  const handleViewEmployee = (
    employee
  ) => {

    setOpenMenu(null);

    console.log(
      "View employee:",
      employee
    );

  };


  /* =====================================================
     EDIT EMPLOYEE
     ===================================================== */

  const handleEditEmployee = (
    employee
  ) => {

    setOpenMenu(null);

    console.log(
      "Edit employee:",
      employee
    );

  };


  /* =====================================================
     DELETE / DEACTIVATE EMPLOYEE
     ===================================================== */

  const handleDeleteEmployee = async (
    employee
  ) => {

    setOpenMenu(null);

    const confirmed =
      window.confirm(
        `Are you sure you want to remove ${employee.first_name || employee.username}?`
      );

    if (!confirmed) {
      return;
    }


    try {

      await api.delete(
        `employees/${employee.id}/`
      );

      await fetchEmployees();

    } catch (error) {

      console.error(
        "Failed to delete employee:",
        error
      );

      alert(
        "Failed to delete employee."
      );

    }

  };


  /* =====================================================
     RENDER
     ===================================================== */

  return (

    <div className="dashboard-page">


      {/* =================================================
          SIDEBAR
          SAME STRUCTURE AS DASHBOARD
          ================================================= */}

      <aside className="dashboard-sidebar">


        {/* BRAND */}

        <div className="sidebar-brand">

          <img
            src={logo}
            alt="Team Sync"
          />

          <div>

            <h2>
              TEAM SYNC
            </h2>

            <span>
              Employee Management
            </span>

          </div>

        </div>


        {/* MAIN */}

        <div className="sidebar-section">

          <p className="sidebar-title">
            MAIN
          </p>

          <Link
            to="/dashboard"
            className="sidebar-link"
          >
            <FiHome />

            <span>
              Dashboard
            </span>

          </Link>

        </div>


        {/* WORKSPACE */}

        <div className="sidebar-section">

          <p className="sidebar-title">
            WORKSPACE
          </p>

          <Link
            to="/workspaces"
            className="sidebar-link"
          >

            <FiFolder />

            <span>
              Workspaces
            </span>

          </Link>


          <Link
            to="/members"
            className="sidebar-link active"
          >

            <FiUsers />

            <span>
              Members
            </span>

          </Link>

        </div>


        {/* PROJECTS */}

        <div className="sidebar-section">

          <p className="sidebar-title">
            PROJECTS
          </p>

          <Link
            to="/projects"
            className="sidebar-link"
          >

            <FiFolder />

            <span>
              Projects
            </span>

          </Link>


          <Link
            to="/tasks"
            className="sidebar-link"
          >

            <FiCheckSquare />

            <span>
              Tasks
            </span>

          </Link>

        </div>


        {/* ATTENDANCE */}

        <div className="sidebar-section">

          <p className="sidebar-title">
            ATTENDANCE
          </p>


          <Link
            to="/attendance"
            className="sidebar-link"
          >

            <FiCalendar />

            <span>
              Attendance
            </span>

          </Link>


          <Link
            to="/leave-requests"
            className="sidebar-link"
          >

            <FiFileText />

            <span>
              Leave Requests
            </span>

          </Link>

        </div>


        {/* COMMUNICATION */}

        <div className="sidebar-section">

          <p className="sidebar-title">
            COMMUNICATION
          </p>


          <Link
            to="/announcements"
            className="sidebar-link"
          >

            <FiVolume2 />

            <span>
              Announcements
            </span>

          </Link>

        </div>


        {/* REPORTS */}

        <div className="sidebar-section">

          <p className="sidebar-title">
            REPORTS
          </p>


          <Link
            to="/reports"
            className="sidebar-link"
          >

            <FiBarChart2 />

            <span>
              Reports
            </span>

          </Link>


          <Link
            to="/settings"
            className="sidebar-link"
          >

            <FiSettings />

            <span>
              Settings
            </span>

          </Link>

        </div>

      </aside>


      {/* =================================================
          MAIN
          ================================================= */}

      <main className="dashboard-main">


        {/* =================================================
            HEADER
            ================================================= */}

        <header className="dashboard-header">


          {/* SEARCH */}

          <div className="dashboard-search">

            <FiSearch />

            <input
              type="text"
              placeholder="Search anything..."
            />

            <span>
              Ctrl + K
            </span>

          </div>


          {/* HEADER ACTIONS */}

          <div className="header-actions">


            {/* NOTIFICATIONS */}

            <button
              className="notification-button"
              type="button"
            >

              <FiBell />

              <span>
                3
              </span>

            </button>


            {/* PROFILE */}

            <div className="profile-wrapper">

              <button
                className="profile-button"
                type="button"
                onClick={(event) => {

                  event.stopPropagation();

                  setProfileOpen(
                    !profileOpen
                  );

                }}
              >

                <div className="profile-avatar">

                  {avatarLetter}

                </div>


                <div className="profile-info">

                  <strong>
                    {fullName}
                  </strong>

                  <span>
                    {displayRole}
                  </span>

                </div>


                <FiChevronDown />

              </button>


              {/* PROFILE DROPDOWN */}

              {profileOpen && (

                <div
                  className="profile-dropdown"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >

                  <div className="dropdown-user">

                    <div className="dropdown-avatar">

                      {avatarLetter}

                    </div>


                    <div>

                      <strong>
                        {fullName}
                      </strong>

                      <span>
                        {displayRole}
                      </span>

                      <small>
                        {email}
                      </small>

                    </div>

                  </div>


                  <div className="dropdown-divider" />


                  <Link to="/profile">

                    <FiUser />

                    My Profile

                  </Link>


                  <Link to="/settings">

                    <FiSettings />

                    Account Settings

                  </Link>


                  <Link to="/change-password">

                    <FiLock />

                    Change Password

                  </Link>


                  <Link to="/help">

                    <FiHelpCircle />

                    Help & Support

                  </Link>


                  <div className="dropdown-divider" />


                  <button
                    className="logout-button"
                    onClick={handleLogout}
                    type="button"
                  >

                    <FiLogOut />

                    Logout

                  </button>

                </div>

              )}

            </div>

          </div>

        </header>


        {/* =================================================
            MEMBERS CONTENT
            ================================================= */}

        <section className="members-content">


          {/* PAGE HEADER */}

          <div className="members-page-header">

            <div>

              <h1>
                Members
              </h1>

              <p>
                Manage your team members and their roles
              </p>

            </div>


            <button
              className="add-employee-button"
              type="button"
              onClick={() =>
                navigate("/employees/add")
              }
            >

              <FiPlus />

              Add Employee

            </button>

          </div>


          {/* =================================================
              STATISTICS
              ================================================= */}

          <div className="member-stat-grid">


            {/* TOTAL */}

            <div className="member-stat-card">

              <div className="stat-icon blue">

                <FiUsers />

              </div>


              <div>

                <span>
                  Total Members
                </span>

                <strong>
                  {totalMembers}
                </strong>

              </div>

            </div>


            {/* ACTIVE */}

            <div className="member-stat-card">

              <div className="stat-icon green">

                <FiUserCheck />

              </div>


              <div>

                <span>
                  Active Members
                </span>

                <strong>
                  {activeMembers}
                </strong>

              </div>

            </div>


            {/* MANAGERS */}

            <div className="member-stat-card">

              <div className="stat-icon orange">

                <FiBriefcase />

              </div>


              <div>

                <span>
                  Managers
                </span>

                <strong>
                  {managers}
                </strong>

              </div>

            </div>


            {/* ADMINS */}

            <div className="member-stat-card">

              <div className="stat-icon purple">

                <FiShield />

              </div>


              <div>

                <span>
                  Admins
                </span>

                <strong>
                  {admins}
                </strong>

              </div>

            </div>

          </div>


          {/* =================================================
              FILTERS
              ================================================= */}

          <div className="members-filter-card">


            {/* SEARCH */}

            <div className="member-search">

              <FiSearch />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search employees..."
              />

            </div>


            {/* ROLE */}

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(
                  event.target.value
                )
              }
            >

              <option value="all">
                All Roles
              </option>

              <option value="admin">
                Admin
              </option>

              <option value="manager">
                Manager
              </option>

              <option value="employee">
                Employee
              </option>

            </select>


            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >

              <option value="all">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>

            </select>

          </div>


          {/* =================================================
              EMPLOYEE TABLE
              ================================================= */}

          <div className="members-table-card">


            {/* TABLE HEADER */}

            <div className="members-table-header">

              <div>
                Employee
              </div>

              <div>
                Email
              </div>

              <div>
                Department
              </div>

              <div>
                Role
              </div>

              <div>
                Status
              </div>

              <div>
                Joined On
              </div>

              <div>
                Actions
              </div>

            </div>


            {/* LOADING */}

            {loading ? (

              <div className="members-loading">

                Loading employees...

              </div>

            ) : filteredEmployees.length === 0 ? (

              /* EMPTY */

              <div className="members-empty">

                <FiUsers />

                <h3>
                  No employees found
                </h3>

                <p>
                  Try changing your search or filters.
                </p>

              </div>

            ) : (

              /* EMPLOYEES */

              filteredEmployees.map(
                (employee) => {

                  const employeeActive =
                    employee.is_active !== false;

                  const employeeName =
                    `${employee.first_name || ""} ${
                      employee.last_name || ""
                    }`.trim() ||
                    employee.username ||
                    "Unknown";


                  return (

                    <div
                      className="member-row"
                      key={employee.id}
                    >


                      {/* EMPLOYEE */}

                      <div className="employee-cell">

                        <div className="employee-avatar">

                          {getInitial(
                            employee
                          )}

                        </div>


                        <div>

                          <strong>
                            {employeeName}
                          </strong>

                          <span>
                            @{employee.username}
                          </span>

                        </div>

                      </div>


                      {/* EMAIL */}

                      <div className="employee-email">

                        {employee.email || "-"}

                      </div>


                      {/* DEPARTMENT */}

                      <div className="employee-department">

                        {employee.department || "-"}

                      </div>


                      {/* ROLE */}

                      <div>

                        <span
                          className={`role-badge ${
                            employee.role || "employee"
                          }`}
                        >

                          {employee.role || "employee"}

                        </span>

                      </div>


                      {/* STATUS */}

                      <div>

                        <span
                          className={`status-badge ${
                            employeeActive
                              ? "active"
                              : "inactive"
                          }`}
                        >

                          <span />

                          {employeeActive
                            ? "Active"
                            : "Inactive"}

                        </span>

                      </div>


                      {/* JOINED */}

                      <div className="joined-date">

                        {formatDate(
                          employee.created_at
                        )}

                      </div>


                      {/* ACTIONS */}

                      <div
                        className="employee-actions"
                        onClick={(event) =>
                          event.stopPropagation()
                        }
                      >

                        <button
                          type="button"
                          onClick={(event) =>
                            handleMenuClick(
                              event,
                              employee.id
                            )
                          }
                          aria-label="Employee actions"
                        >

                          <FiMoreVertical />

                        </button>


                        {openMenu ===
                          employee.id && (

                          <div className="employee-action-menu">


                            <button
                              type="button"
                              onClick={() =>
                                handleViewEmployee(
                                  employee
                                )
                              }
                            >
                              View Profile
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                handleEditEmployee(
                                  employee
                                )
                              }
                            >
                              Edit Employee
                            </button>


                            <button
                              type="button"
                              onClick={() =>
                                console.log(
                                  "Change role:",
                                  employee
                                )
                              }
                            >
                              Change Role
                            </button>


                            <button
                              type="button"
                              className="danger"
                              onClick={() =>
                                handleDeleteEmployee(
                                  employee
                                )
                              }
                            >
                              Delete Employee
                            </button>


                          </div>

                        )}

                      </div>

                    </div>

                  );

                }
              )

            )}

          </div>

        </section>

      </main>

    </div>

  );

}

export default Members;