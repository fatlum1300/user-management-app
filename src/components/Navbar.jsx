import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          <span className="navbar-logo-dot" />
          UserHub
        </NavLink>
        <ul className="navbar-nav">
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
              Users
            </NavLink>
          </li>
          <li>
            <NavLink to="/add" className={({ isActive }) => isActive ? "active" : ""}>
              Add User
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
