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

        {/* SEARCH */}
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

        {/* RIGHT */}
        <div className="nav-right">

          {!token ? (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          ) : (
            <button className="login-btn" onClick={handleLogout}>
              Logout
            </button>
          )}

          <button className="menu-btn" onClick={() => setOpen(true)}>
            <Menu size={26} />
          </button>

        </div>

      </div>

      {/* DRAWER */}
      <div className={`drawer ${open ? "active" : ""}`}>

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