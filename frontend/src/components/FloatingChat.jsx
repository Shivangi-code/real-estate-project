import React from "react";
import { Home } from "lucide-react";
import "../styles/FloatingChat.css";

const FloatingChat = ({ onClick }) => {
  return (
    <div className="floating-chat" onClick={onClick}>
      
      <div className="border-animate"></div>

      <div className="content">
        <Home size={22} />
        <span className="label">Ask</span>
      </div>

    </div>
  );
};

export default FloatingChat;