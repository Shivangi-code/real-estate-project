import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, User } from "lucide-react";
import logo from "../assets/logo.png";
import "../styles/navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleSellClick = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (role === "seller" || role === "agent" || role === "builder") {
      navigate("/add-property");
    } else {
      alert("Please login as seller, agent or builder to add property.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar">

        {/* LEFT LOGO */}
        <div className="nav-left">
          <img src={logo} alt="Housify" className="nav-logo" />
        </div>

        {/* CENTER SEARCH */}
        <div className="nav-center">
          <div className="search-box">
            <span className="location-fixed">Jabalpur</span>
            <input
              type="text"
              placeholder="Search locality, project..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search size={18} />
          </div>
        </div>

        {/* RIGHT BUTTONS */}
        <div className="nav-right">

          <Link to="/about" className="login-btn">
            About Us
          </Link>

          {/* ✅ NEW */}
          <Link to="/chat" className="login-btn">
            Chat
          </Link>

          <Link to="/contact" className="login-btn">
            Contact
          </Link>

          {/* Login / Logout */}
          {!token ? (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          ) : (
            <button className="login-btn" onClick={handleLogout}>
              Logout
            </button>
          )}

          {/* Mobile Menu Button */}
          <button className="menu-btn" onClick={() => setOpen(true)}>
            <Menu size={26} />
          </button>
        </div>
      </div>

      {/* DRAWER (Mobile Menu) */}
      <div className={`drawer ${open ? "active" : ""}`}>

        {/* HEADER */}
        <div className="drawer-header">
          <X size={26} onClick={() => setOpen(false)} />
        </div>

        {/* PROFILE */}
        {token && (
          <div className="drawer-profile">
            <User size={32} />
            <div>
              <p className="profile-name">Logged In</p>
              <p className="profile-role">{role}</p>
            </div>
          </div>
        )}

        {/* LINKS */}
        <Link to="/" onClick={() => setOpen(false)}>
          Buy Property
        </Link>

        <button onClick={handleSellClick} className="drawer-btn">
          Sell Property
        </button>

        {/* USER OPTIONS */}
        {token && (
          <>
            <Link to="/my-properties" onClick={() => setOpen(false)}>
              My Properties
            </Link>
            <Link to="/saved" onClick={() => setOpen(false)}>
              Saved Properties
            </Link>
          </>
        )}

        <Link to="/agent" onClick={() => setOpen(false)}>
          Agents
        </Link>

        <Link to="/builder" onClick={() => setOpen(false)}>
          Builders
        </Link>

        <Link to="/about" onClick={() => setOpen(false)}>
          About Us
        </Link>

        {/* ✅ NEW */}
        <Link to="/chat" onClick={() => setOpen(false)}>
          Chat
        </Link>

        <Link to="/contact" onClick={() => setOpen(false)}>
          Contact
        </Link>

        {/* ADMIN */}
        {role === "admin" && (
          <Link to="/admin" onClick={() => setOpen(false)}>
            Admin Dashboard
          </Link>
        )}

        {/* LOGIN / LOGOUT */}
        {!token ? (
          <Link to="/login" onClick={() => setOpen(false)}>
            Login
          </Link>
        ) : (
          <button className="drawer-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      {/* OVERLAY */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
    </>
  );
}

export default Navbar;