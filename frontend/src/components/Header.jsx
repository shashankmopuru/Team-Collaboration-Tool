import "../styles/Header.css";
import logo from "../assets/logo.png";

import { FaBell, FaUserCircle, FaSearch } from "react-icons/fa";

function Header() {
  return (
    <header className="header">

      <div className="brand">

        <img src={logo} alt="Team Sync Logo" className="logo-image" />

        <div className="brand-text">
          <h2>Team Sync</h2>
          <span>Collaborate • Organize • Deliver</span>
        </div>

      </div>

      <div className="search-box">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search projects, tasks..."
        />

      </div>

      <div className="header-icons">

        <FaBell className="icon" />

        <FaUserCircle className="icon profile" />

      </div>

    </header>
  );
}

export default Header;