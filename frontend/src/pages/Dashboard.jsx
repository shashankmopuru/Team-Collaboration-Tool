import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiHome,
  FiFolder,
  FiUsers,
  FiCheckSquare,
  FiCalendar,
  FiFileText,
  FiBell,
  FiMessageSquare,
  FiBarChart2,
  FiPieChart,
  FiSearch,
  FiBell as BellIcon,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLock,
  FiHelpCircle,
  FiLogOut,
  FiPlus,
  FiUserPlus,
  FiClock,
  FiMoreVertical,
  FiArrowUpRight,
  FiHeadphones,
} from "react-icons/fi";

import api from "../services/api";
import logo from "../assets/logo.png";

import "../styles/Dashboard.css";


function Dashboard() {

  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);


  // =========================
  // FETCH LOGGED-IN USER
  // =========================

  useEffect(() => {

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

      } finally {

        setProfileLoading(false);

      }

    };

    fetchProfile();

  }, [navigate]);


  // =========================
  // USER DATA
  // =========================

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
    profile?.profile?.role || "Employee";

  const avatarLetter = (
    profile?.first_name?.charAt(0) ||
    profile?.username?.charAt(0) ||
    "U"
  ).toUpperCase();


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    navigate("/login");

  };


  return (

    <div className="dashboard-page">


      {/* ================================
          SIDEBAR
      ================================= */}

      <aside className="dashboard-sidebar">


        {/* LOGO */}

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
            className="sidebar-link active"
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
            className="sidebar-link"
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

            <FiBell />

            <span>
              Announcements
            </span>

          </Link>

          <Link
            to="/messages"
            className="sidebar-link"
          >

            <FiMessageSquare />

            <span>
              Messages
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
            to="/analytics"
            className="sidebar-link"
          >

            <FiPieChart />

            <span>
              Analytics
            </span>

          </Link>

        </div>


        {/* HELP */}

        <div className="sidebar-help">

          <h4>
            Need Help?
          </h4>

          <p>
            Contact support for any
            assistance
          </p>

          <button>

            <FiHeadphones />

            Contact Support

          </button>

        </div>

      </aside>


      {/* ================================
          MAIN CONTENT
      ================================= */}

      <main className="dashboard-main">


        {/* ================================
            TOP HEADER
        ================================= */}

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


          {/* HEADER RIGHT */}

          <div className="header-actions">


            {/* NOTIFICATION */}

            <button className="notification-button">

              <BellIcon />

              <span>
                3
              </span>

            </button>


            {/* PROFILE */}

            <div className="profile-wrapper">


              <button
                className="profile-button"
                onClick={() =>
                  setProfileOpen(
                    (previous) => !previous
                  )
                }
              >

                <div className="profile-avatar">

                  {avatarLetter}

                </div>


                <div className="profile-info">

                  <strong>

                    {
                      profileLoading
                        ? "Loading..."
                        : fullName
                    }

                  </strong>

                  <span>

                    {
                      profileLoading
                        ? ""
                        : role
                    }

                  </span>

                </div>


                <FiChevronDown />

              </button>


              {/* PROFILE DROPDOWN */}

              {profileOpen && (

                <div className="profile-dropdown">


                  <div className="dropdown-user">


                    <div className="dropdown-avatar">

                      {avatarLetter}

                    </div>


                    <div>

                      <strong>
                        {fullName}
                      </strong>

                      <span>
                        {role}
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
                  >

                    <FiLogOut />

                    Logout

                  </button>


                </div>

              )}


            </div>

          </div>

        </header>


        {/* ================================
            DASHBOARD CONTENT
        ================================= */}

        <div className="dashboard-content">


          {/* WELCOME */}

          <div className="welcome-section">

            <h1>

              Welcome back, {firstName}! 👋

            </h1>

            <p>

              Here's what's happening with
              your team today.

            </p>

          </div>


          {/* ================================
              KPI CARDS
          ================================= */}

          <div className="kpi-grid">


            <div className="kpi-card">

              <div className="kpi-icon blue">
                <FiUsers />
              </div>

              <div className="kpi-content">

                <span>
                  Total Employees
                </span>

                <strong>
                  128
                </strong>

                <small>
                  ↑ 12% from last month
                </small>

              </div>

            </div>


            <div className="kpi-card">

              <div className="kpi-icon green">
                <FiFolder />
              </div>

              <div className="kpi-content">

                <span>
                  Active Projects
                </span>

                <strong>
                  12
                </strong>

                <small>
                  ↑ 8% from last month
                </small>

              </div>

            </div>


            <div className="kpi-card">

              <div className="kpi-icon purple">
                <FiCheckSquare />
              </div>

              <div className="kpi-content">

                <span>
                  Tasks Completed
                </span>

                <strong>
                  230
                </strong>

                <small>
                  ↑ 15% from last month
                </small>

              </div>

            </div>


            <div className="kpi-card">

              <div className="kpi-icon orange">
                <FiCalendar />
              </div>

              <div className="kpi-content">

                <span>
                  Attendance Today
                </span>

                <strong>
                  96%
                </strong>

                <small>
                  ↑ 5% from yesterday
                </small>

              </div>

            </div>

          </div>


          {/* ================================
              CHART SECTION
          ================================= */}

          <div className="dashboard-middle">


            {/* PROJECT OVERVIEW */}

            <div className="dashboard-card project-chart">

              <div className="card-header">

                <h3>
                  Project Overview
                </h3>

                <select>

                  <option>
                    This Month
                  </option>

                  <option>
                    Last Month
                  </option>

                  <option>
                    This Year
                  </option>

                </select>

              </div>


              <div className="chart-area">

                <div className="chart-y-axis">

                  <span>100</span>
                  <span>80</span>
                  <span>60</span>
                  <span>40</span>
                  <span>20</span>
                  <span>0</span>

                </div>


                <div className="line-chart">

                  <div className="grid-line line-1" />
                  <div className="grid-line line-2" />
                  <div className="grid-line line-3" />
                  <div className="grid-line line-4" />
                  <div className="grid-line line-5" />


                  <svg
                    viewBox="0 0 700 240"
                    preserveAspectRatio="none"
                  >

                    <defs>

                      <linearGradient
                        id="chartGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >

                        <stop
                          offset="0%"
                          stopColor="#2f80ed"
                          stopOpacity="0.25"
                        />

                        <stop
                          offset="100%"
                          stopColor="#2f80ed"
                          stopOpacity="0"
                        />

                      </linearGradient>

                    </defs>


                    <path
                      d="M10 210
                      C60 190 75 175 120 160
                      C165 145 185 175 220 150
                      C260 125 290 115 330 125
                      C365 135 390 90 425 85
                      C460 80 480 120 515 110
                      C555 98 580 75 620 65
                      C650 55 675 35 695 25
                      L695 240
                      L10 240 Z"
                      fill="url(#chartGradient)"
                    />


                    <path
                      d="M10 210
                      C60 190 75 175 120 160
                      C165 145 185 175 220 150
                      C260 125 290 115 330 125
                      C365 135 390 90 425 85
                      C460 80 480 120 515 110
                      C555 98 580 75 620 65
                      C650 55 675 35 695 25"
                      fill="none"
                      stroke="#2779e6"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />

                  </svg>


                  <div className="chart-labels">

                    <span>May 1</span>
                    <span>May 8</span>
                    <span>May 15</span>
                    <span>May 22</span>
                    <span>May 29</span>

                  </div>

                </div>

              </div>


              <div className="chart-legend">

                <span>

                  <i />

                  Tasks Completed

                </span>

              </div>

            </div>


            {/* TASK SUMMARY */}

            <div className="dashboard-card task-summary">

              <div className="card-header">

                <h3>
                  Task Summary
                </h3>

              </div>


              <div className="donut-section">

                <div className="donut-chart">

                  <div className="donut-center">

                    <strong>
                      230
                    </strong>

                    <span>
                      Total Tasks
                    </span>

                  </div>

                </div>


                <div className="donut-legend">

                  <div>

                    <i className="completed" />

                    <span>

                      Completed

                      <small>
                        120 (52%)
                      </small>

                    </span>

                  </div>


                  <div>

                    <i className="progress" />

                    <span>

                      In Progress

                      <small>
                        70 (30%)
                      </small>

                    </span>

                  </div>


                  <div>

                    <i className="pending" />

                    <span>

                      Pending

                      <small>
                        40 (18%)
                      </small>

                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* QUICK ACTIONS */}

            <div className="dashboard-card quick-actions">

              <div className="card-header">

                <h3>
                  Quick Actions
                </h3>

              </div>


              <button>

                <FiPlus />

                Create Workspace

              </button>


              <button>

                <FiPlus />

                New Project

              </button>


              <button>

                <FiUserPlus />

                Invite Member

              </button>


              <button>

                <FiClock />

                Mark Attendance

              </button>

            </div>

          </div>


          {/* ================================
              BOTTOM SECTION
          ================================= */}

          <div className="dashboard-bottom">


            {/* RECENT PROJECTS */}

            <div className="dashboard-card recent-projects">

              <div className="card-header">

                <h3>
                  Recent Projects
                </h3>

                <Link to="/projects">
                  View All
                </Link>

              </div>


              <div className="project-list">


                <div className="project-row">

                  <div className="project-symbol blue">
                    <FiUsers />
                  </div>

                  <div className="project-name">

                    <strong>
                      Employee Management System
                    </strong>

                    <span>
                      Team Sync
                    </span>

                  </div>

                  <span className="status in-progress">
                    In Progress
                  </span>

                  <span className="due-date">
                    Due: Jun 15, 2025
                  </span>

                  <FiMoreVertical />

                </div>


                <div className="project-row">

                  <div className="project-symbol green">
                    <FiBarChart2 />
                  </div>

                  <div className="project-name">

                    <strong>
                      Analytics Dashboard
                    </strong>

                    <span>
                      Data Team
                    </span>

                  </div>

                  <span className="status in-progress">
                    In Progress
                  </span>

                  <span className="due-date">
                    Due: Jun 20, 2025
                  </span>

                  <FiMoreVertical />

                </div>


                <div className="project-row">

                  <div className="project-symbol purple">
                    <FiFolder />
                  </div>

                  <div className="project-name">

                    <strong>
                      Mobile App Development
                    </strong>

                    <span>
                      Development Team
                    </span>

                  </div>

                  <span className="status planning">
                    Planning
                  </span>

                  <span className="due-date">
                    Due: Jul 10, 2025
                  </span>

                  <FiMoreVertical />

                </div>


                <div className="project-row">

                  <div className="project-symbol orange">
                    <FiFileText />
                  </div>

                  <div className="project-name">

                    <strong>
                      Website Redesign
                    </strong>

                    <span>
                      Design Team
                    </span>

                  </div>

                  <span className="status hold">
                    On Hold
                  </span>

                  <span className="due-date">
                    Due: Jul 25, 2025
                  </span>

                  <FiMoreVertical />

                </div>

              </div>

            </div>


            {/* DEADLINES */}

            <div className="dashboard-card deadlines">

              <div className="card-header">

                <h3>
                  Upcoming Deadlines
                </h3>

                <Link to="/projects">
                  View All
                </Link>

              </div>


              <div className="deadline-list">


                <div className="deadline-row">

                  <div className="date-box">

                    <span>
                      JUN
                    </span>

                    <strong>
                      15
                    </strong>

                  </div>

                  <div className="deadline-info">

                    <strong>
                      Employee Management System
                    </strong>

                    <span>
                      Design System Module
                    </span>

                  </div>

                  <em className="urgent">
                    2 days left
                  </em>

                </div>


                <div className="deadline-row">

                  <div className="date-box">

                    <span>
                      JUN
                    </span>

                    <strong>
                      20
                    </strong>

                  </div>

                  <div className="deadline-info">

                    <strong>
                      Analytics Dashboard
                    </strong>

                    <span>
                      User Analytics Reports
                    </span>

                  </div>

                  <em>
                    7 days left
                  </em>

                </div>


                <div className="deadline-row">

                  <div className="date-box">

                    <span>
                      JUN
                    </span>

                    <strong>
                      25
                    </strong>

                  </div>

                  <div className="deadline-info">

                    <strong>
                      Mobile App Development
                    </strong>

                    <span>
                      API Integration
                    </span>

                  </div>

                  <em>
                    12 days left
                  </em>

                </div>


                <div className="deadline-row">

                  <div className="date-box">

                    <span>
                      JUL
                    </span>

                    <strong>
                      10
                    </strong>

                  </div>

                  <div className="deadline-info">

                    <strong>
                      Website Redesign
                    </strong>

                    <span>
                      UI/UX Final Review
                    </span>

                  </div>

                  <em className="safe">
                    27 days left
                  </em>

                </div>

              </div>

            </div>


            {/* ACTIVITY */}

            <div className="dashboard-card activity">

              <div className="card-header">

                <h3>
                  Recent Activity
                </h3>

                <Link to="/activity">
                  View All
                </Link>

              </div>


              <div className="activity-list">


                <div className="activity-item">

                  <div className="activity-avatar">
                    PS
                  </div>

                  <div>

                    <p>

                      <strong>
                        Priya Sharma
                      </strong>{" "}

                      completed

                    </p>

                    <span>
                      "User Authentication Module"
                    </span>

                    <small>
                      2 hours ago
                    </small>

                  </div>

                  <span className="activity-check">
                    ✓
                  </span>

                </div>


                <div className="activity-item">

                  <div className="activity-avatar">
                    RK
                  </div>

                  <div>

                    <p>

                      <strong>
                        Rohit Kumar
                      </strong>{" "}

                      created a new project

                    </p>

                    <span>
                      "Analytics Dashboard"
                    </span>

                    <small>
                      5 hours ago
                    </small>

                  </div>

                  <span className="activity-plus">
                    +
                  </span>

                </div>


                <div className="activity-item">

                  <div className="activity-avatar">
                    AP
                  </div>

                  <div>

                    <p>

                      <strong>
                        Anita Patel
                      </strong>{" "}

                      requested leave

                    </p>

                    <span>
                      June 18, 2025
                    </span>

                    <small>
                      1 day ago
                    </small>

                  </div>

                  <span className="activity-calendar">

                    <FiCalendar />

                  </span>

                </div>


                <div className="activity-item">

                  <div className="activity-avatar">
                    YS
                  </div>

                  <div>

                    <p>

                      <strong>
                        You
                      </strong>{" "}

                      updated project status

                    </p>

                    <span>
                      "Employee Management System"
                    </span>

                    <small>
                      2 days ago
                    </small>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* FOOTER */}

          <footer className="dashboard-footer">

            <span>
              © 2025 Team Sync. All rights reserved.
            </span>

            <div>

              <a href="#privacy">
                Privacy Policy
              </a>

              <a href="#terms">
                Terms of Service
              </a>

            </div>

          </footer>

        </div>

      </main>

    </div>

  );

}


export default Dashboard;