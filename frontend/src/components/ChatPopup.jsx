import React, { useState, useRef, useEffect } from "react";
import "../styles/ChatPopup.css";

const ChatPopup = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // 🧭 AUTO SCROLL REF (ADDED)
  const chatEndRef = useRef(null);

  // 🧭 AUTO SCROLL EFFECT (ADDED)
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  // 👋 Greeting check
  const isGreeting = (text) => {
    const msg = text.toLowerCase().trim();
    return ["hi", "hii", "hiii", "hello", "hey","hiee","hie","hye","hlo","ho","heyy"].includes(msg);
  };

  // 🏡 Property intent check
  const isPropertyIntent = (text) => {
    const msg = text.toLowerCase();
    return (
      msg.includes("property") ||
      msg.includes("flat") ||
      msg.includes("house") ||
      msg.includes("plot") ||
      msg.includes("rent") ||
      msg.includes("buy")
    );
  };

  // 📍 Jabalpur check (ONLY allowed location)
  const isJabalpur = (text) => {
    return text.toLowerCase().includes("jabalpur");
  };

  // 📞 CONTACT INTENT
  const isContactIntent = (text) => {
    const msg = text.toLowerCase();
    return (
      msg.includes("contact") ||
      msg.includes("call") ||
      msg.includes("whatsapp") ||
      msg.includes("email") ||
      msg.includes("agent")
    );
  };

  const handleSend = () => {
    if (!message.trim()) return;

    const userMsg = message;
    setMessage("");

    // add user message
    setMessages((prev) => [
      ...prev,
      { text: userMsg, sender: "user" }
    ]);

    // 1️⃣ GREETING FIRST
    if (isGreeting(userMsg)) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "Hello 👋", sender: "bot" }
        ]);
      }, 300);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "Welcome to Housify Realty 🏡 Jabalpur", sender: "bot" }
        ]);
      }, 900);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text:
              "I’m your local property assistant for Jabalpur.\nI can help you find flats, houses, and plots.",
            sender: "bot"
          }
        ]);
      }, 1500);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "How can I help you today?", sender: "bot" }
        ]);
      }, 2100);

      return;
    }

    // 2️⃣ CONTACT INTENT (SPLIT MESSAGES ADDED)
    if (isContactIntent(userMsg)) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "🏡 Housify Realty – Jabalpur", sender: "bot" }
        ]);
      }, 300);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "📞 Call / WhatsApp: +91-74159 30089", sender: "bot" }
        ]);
      }, 700);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "📧 Email: housifyrealty.info@gmail.com", sender: "bot" }
        ]);
      }, 1100);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { text: "📍 Location: Jabalpur, Madhya Pradesh", sender: "bot" }
        ]);
      }, 1500);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text:
              "🕒 Availability: Monday – Sunday | 8:00 AM – 10:00 PM",
            sender: "bot"
          }
        ]);
      }, 1900);

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text:
              "👉 Contact us for verified properties, site visits & best deals in Jabalpur 🏡",
            sender: "bot"
          }
        ]);
      }, 2300);

      return;
    }

    // 3️⃣ PROPERTY OUTSIDE JABALPUR → BLOCK
    if (isPropertyIntent(userMsg) && !isJabalpur(userMsg)) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text:
              "We currently operate only in Jabalpur 🏡\n\n" +
              "We do not provide property listings for other cities or other locations.\n\n" +
              "But I can help you find the best homes, flats, and plots in Jabalpur 😊",
            sender: "bot"
          }
        ]);
      }, 600);

      return;
    }

    // 4️⃣ DEFAULT JABALPUR FLOW
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text:
            "Got it 👍 I can help you find properties in Jabalpur.\n\n" +
            "Tell me your budget or preferred area like Wright Town, Vijay Nagar, or Napier Town.",
          sender: "bot"
        }
      ]);
    }, 800);
  };

  // ⌨️ Enter key support
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="chat-popup">

      {/* HEADER */}
      <div className="chat-header">
        <span>🏡 Property Assistant</span>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      {/* BODY */}
      <div className="chat-body">

        {messages.length === 0 && (
          <div className="bot-msg">
            Hello 👋<br />
            Welcome to Housify Realty 🏡 Jabalpur<br />
            How can I help you today?
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.sender === "user" ? "user-msg" : "bot-msg"}
          >
            {msg.text}
          </div>
        ))}

        {/* 🧭 AUTO SCROLL ANCHOR (ADDED) */}
        <div ref={chatEndRef} />

      </div>

      {/* FOOTER */}
      <div className="chat-footer">

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about properties in Jabalpur..."
        />

        <button onClick={handleSend}>
          Send
        </button>

      </div>

    </div>
  );
};

export default ChatPopup;