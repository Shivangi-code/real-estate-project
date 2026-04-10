import React, { useState } from "react";
 import "../styles/ChatPopup.css";
const ChatPopup = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  if (!isOpen) return null;

  // Send message function
  const handleSend = () => {
    if (message.trim() === "") return;

    setMessages([...messages, { text: message, sender: "user" }]);
    setMessage("");

    // Fake auto reply (demo)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Thanks for your message! 😊", sender: "bot" }
      ]);
    }, 1000);
  };

  return (
    <div className="chat-popup">

      {/* Header */}
      <div className="chat-header">
        <span>💬 Chat Support</span>
        <button className="close-btn" onClick={onClose}>✖</button>
      </div>

      {/* Messages */}
      <div className="chat-body">
        {messages.length === 0 && (
          <p><strong>Support:</strong> Hello! How can I help you? 😊</p>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === "user" ? "user-msg" : "bot-msg"}>
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="send-btn" onClick={handleSend}>
          Send
        </button>
      </div>

    </div>
  );
};

export default ChatPopup;