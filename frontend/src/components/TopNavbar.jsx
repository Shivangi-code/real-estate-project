import React from "react";
import { Phone } from "lucide-react";
import "../styles/topnavbar.css";

function TopNavbar() {
  return (
    <div className="top-navbar">

      {/* LEFT INFO */}
      <div className="top-left">
        <span className="desktop-location">
          📍 Jabalpur, Madhya Pradesh
        </span>

        <span className="mobile-location">
          📍 Jabalpur
        </span>

        <span> • Local team • Quick response</span>
      </div>

      {/* RIGHT CALL BUTTON */}
      <div className="top-right">

        <button className="call-btn desktop-call">
          <Phone size={16} />
          Call / WhatsApp: +91-7415930089
        </button>

        <a
          href="tel:+917415930089"
          className="mobile-call-btn"
        >
          <Phone size={13} />
          <span>+91-7415930089</span>
        </a>

      </div>

    </div>
  );
}

export default TopNavbar;