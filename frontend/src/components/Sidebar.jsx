import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Menu</h3>

      <ul>
        <li>Dashboard</li>
        <li>Projects</li>
        <li>Tasks</li>
        <li>Members</li>
        <li>Reports</li>
      </ul>
    </aside>
  );
}

export default Sidebar;