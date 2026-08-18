import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiPlus,
  FiBell,
  FiChevronDown,
  FiUsers,
  FiUserCheck,
  FiBriefcase,
  FiShield,
  FiMoreVertical,
  FiHome,
  FiFolder,
  FiCheckSquare,
  FiCalendar,
  FiFileText,
  FiVolume2,
  FiBarChart2,
  FiSettings,
} from "react-icons/fi";

import "../styles/Dashboard.css";
import api from "../services/api";
import "../styles/Members.css";

function Members() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get("employees/");
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to load employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      employee.username?.toLowerCase().includes(searchText) ||
      employee.email?.toLowerCase().includes(searchText) ||
      employee.department?.toLowerCase().includes(searchText) ||
      employee.first_name?.toLowerCase().includes(searchText) ||
      employee.last_name?.toLowerCase().includes(searchText);

    const matchesRole =
      roleFilter === "all" ||
      employee.role?.toLowerCase() === roleFilter;

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && employee.is_active !== false) ||
      (statusFilter === "inactive" && employee.is_active === false);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalMembers = employees.length;

  const activeMembers = employees.filter(
    (employee) => employee.is_active !== false
  ).length;

  const managers = employees.filter(
    (employee) => employee.role === "manager"
  ).length;

  const admins = employees.filter(
    (employee) => employee.role === "admin"
  ).length;

  const getFullName = (employee) => {
    const fullName = [
      employee.first_name,
      employee.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    return fullName || employee.username || "Unknown User";
  };

  const getInitial = (employee) => {
    return (
      employee.first_name?.charAt(0) ||
      employee.username?.charAt(0) ||
      "U"
    ).toUpperCase();
  };

  return (
    <div className="members-layout">

      {/* SIDEBAR */}

      <aside className="members-sidebar">

        <div className="members-brand">
          <div className="members-brand-logo">
            <img src={logo} alt="Team Sync" />
          </div>

          <div>
            <h2>TEAM SYNC</h2>
            <span>Employee Management</span>
          </div>
        </div>

        <nav className="members-nav">

          <div className="nav-section-title">
            MAIN
          </div>

          <Link to="/dashboard" className="members-nav-item">
            <FiHome />
            <span>Dashboard</span>
          </Link>

          <div className="nav-section-title">
            WORKSPACE
          </div>

          <Link to="/workspaces" className="members-nav-item">
            <FiFolder />
            <span>Workspaces</span>
          </Link>

          <Link
            to="/members"
            className="members-nav-item active"
          >
            <FiUsers />
            <span>Members</span>
          </Link>

          <div className="nav-section-title">
            PROJECTS
          </div>

          <Link to="/projects" className="members-nav-item">
            <FiFolder />
            <span>Projects</span>
          </Link>

          <Link to="/tasks" className="members-nav-item">
            <FiCheckSquare />
            <span>Tasks</span>
          </Link>

          <div className="nav-section-title">
            ATTENDANCE
          </div>

          <Link to="/attendance" className="members-nav-item">
            <FiCalendar />
            <span>Attendance</span>
          </Link>

          <Link to="/leave-requests" className="members-nav-item">
            <FiFileText />
            <span>Leave Requests</span>
          </Link>

          <div className="nav-section-title">
            COMMUNICATION
          </div>

          <Link to="/announcements" className="members-nav-item">
            <FiVolume2 />
            <span>Announcements</span>
          </Link>

          <div className="nav-section-title">
            REPORTS
          </div>

          <Link to="/reports" className="members-nav-item">
            <FiBarChart2 />
            <span>Reports</span>
          </Link>

          <Link to="/settings" className="members-nav-item">
            <FiSettings />
            <span>Settings</span>
          </Link>

        </nav>

      </aside>


      {/* MAIN AREA */}

      <main className="members-main">

        {/* HEADER */}

        <header className="members-header">

          <div className="members-global-search">
            <FiSearch />

            <input
              type="text"
              placeholder="Search anything..."
            />

            <span>Ctrl + K</span>
          </div>

          <div className="members-header-right">

            <button className="notification-button">
              <FiBell />
              <span>3</span>
            </button>

            <div className="header-profile">

              <div className="header-avatar">
                S
              </div>

              <div>
                <strong>Shashank Reddy</strong>
                <small>Admin</small>
              </div>

              <FiChevronDown />

            </div>

          </div>

        </header>


        {/* CONTENT */}

        <section className="members-content">

          {/* PAGE TITLE */}

          <div className="members-page-header">

            <div>
              <h1>Members</h1>

              <p>
                Manage your team members and their roles
              </p>
            </div>

            <button className="add-employee-button">
              <FiPlus />
              Add Employee
            </button>

          </div>


          {/* STAT CARDS */}

          <div className="member-stat-grid">

            <div className="member-stat-card">

              <div className="stat-icon blue">
                <FiUsers />
              </div>

              <div>
                <span>Total Members</span>
                <strong>{totalMembers}</strong>
                <small>All employees</small>
              </div>

            </div>


            <div className="member-stat-card">

              <div className="stat-icon green">
                <FiUserCheck />
              </div>

              <div>
                <span>Active Members</span>
                <strong>{activeMembers}</strong>
                <small>
                  {totalMembers
                    ? Math.round(
                        (activeMembers / totalMembers) * 100
                      )
                    : 0}
                  % of total
                </small>
              </div>

            </div>


            <div className="member-stat-card">

              <div className="stat-icon orange">
                <FiBriefcase />
              </div>

              <div>
                <span>Managers</span>
                <strong>{managers}</strong>
                <small>Team managers</small>
              </div>

            </div>


            <div className="member-stat-card">

              <div className="stat-icon purple">
                <FiShield />
              </div>

              <div>
                <span>Admins</span>
                <strong>{admins}</strong>
                <small>System admins</small>
              </div>

            </div>

          </div>


          {/* FILTER BAR */}

          <div className="members-filter-card">

            <div className="member-search">

              <FiSearch />

              <input
                type="text"
                placeholder="Search by name, email or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>


            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>


            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

          </div>


          {/* MEMBERS TABLE */}

          <div className="members-table-card">

            <div className="members-table-header">

              <div>Employee</div>
              <div>Email</div>
              <div>Department</div>
              <div>Role</div>
              <div>Status</div>
              <div>Joined On</div>
              <div>Actions</div>

            </div>


            {loading ? (

              <div className="members-loading">
                Loading members...
              </div>

            ) : filteredEmployees.length === 0 ? (

              <div className="members-empty">
                <FiUsers />
                <h3>No members found</h3>
                <p>
                  Try changing your search or filters.
                </p>
              </div>

            ) : (

              filteredEmployees.map((employee) => (

                <div
                  className="member-row"
                  key={employee.id}
                >

                  <div className="employee-cell">

                    <div className="employee-avatar">
                      {getInitial(employee)}
                    </div>

                    <div>
                      <strong>
                        {getFullName(employee)}
                      </strong>

                      <span>
                        {employee.username}
                      </span>
                    </div>

                  </div>


                  <div className="employee-email">
                    {employee.email}
                  </div>


                  <div className="employee-department">
                    {employee.department || "—"}
                  </div>


                  <div>

                    <span
                      className={`role-badge ${
                        employee.role || "employee"
                      }`}
                    >
                      {employee.role || "Employee"}
                    </span>

                  </div>


                  <div>

                    <span
                      className={`status-badge ${
                        employee.is_active === false
                          ? "inactive"
                          : "active"
                      }`}
                    >
                      <span></span>

                      {employee.is_active === false
                        ? "Inactive"
                        : "Active"}
                    </span>

                  </div>


                  <div className="joined-date">

                    {employee.date_joined
                      ? new Date(
                          employee.date_joined
                        ).toLocaleDateString()
                      : "—"}

                  </div>


                  <div className="employee-actions">

                    <button
                      onClick={() =>
                        setOpenMenu(
                          openMenu === employee.id
                            ? null
                            : employee.id
                        )
                      }
                    >
                      <FiMoreVertical />
                    </button>


                    {openMenu === employee.id && (

                      <div className="employee-action-menu">

                        <button>
                          View Profile
                        </button>

                        <button>
                          Edit Employee
                        </button>

                        <button>
                          Change Role
                        </button>

                        <button className="danger">
                          Deactivate
                        </button>

                      </div>

                    )}

                  </div>

                </div>

              ))

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Members;