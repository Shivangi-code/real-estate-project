import React from "react";
import { Phone } from "lucide-react";
import "../styles/topnavbar.css";

function TopNavbar() {
  return (
    <div className="top-navbar">

      {/* LEFT INFO */}
      <div className="top-left">
        📍 Jabalpur, Madhya Pradesh • Local team • Quick response
      </div>

      {/* RIGHT CALL BUTTON */}
      <div className="top-right">
        <button className="call-btn">
          <Phone size={16} />
          Call / WhatsApp: 7415930089
        </button>
      </div>

    </div>
  );
}

export default TopNavbar;