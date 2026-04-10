import React from "react";
import { FaComments } from "react-icons/fa";
import "../styles/FloatingChat.css";   // ✅ correct path (styles folder)

const FloatingChat = ({ onClick }) => {
  return (
    <div className="floating-chat" onClick={onClick}>
      <FaComments size={22} />
    </div>
  );
};

export default FloatingChat;