import React, { useState, useRef, useEffect } from "react";
import "../styles/ChatPopup.css";

const ChatPopup = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [usedOptions, setUsedOptions] = useState([]);

  const chatEndRef = useRef(null);
  const hasWelcomed = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      chatEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [messages, showOptions]);

  useEffect(() => {
    if (usedOptions.length === 3) {
      setTimeout(() => {
        setUsedOptions([]);
      }, 1000);
    }
  }, [usedOptions]);

  const addMsg = (text, sender = "bot") => {
    setMessages((prev) => [...prev, { text, sender }]);

    if (sender === "bot") {
      setTimeout(() => setShowOptions(true), 350);
    }
  };

  // GREETING
  useEffect(() => {
    if (!isOpen) return;

    if (hasWelcomed.current) return;
    hasWelcomed.current = true;

    setMessages([]);
    setShowOptions(false);

    setTimeout(() => {
      addMsg("Hello 👋 Welcome to Housify Realty Team", "bot");
    }, 200);

    setTimeout(() => {
      addMsg("We’re your trusted property assistant for Jabalpur.", "bot");
    }, 700);

    setTimeout(() => {
      addMsg(
        "I can help you with buying, renting, and exploring properties in prime locations.",
        "bot"
      );
    }, 1200);

    setTimeout(() => setShowOptions(true), 1600);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      hasWelcomed.current = false;
      setMessages([]);
      setShowOptions(false);
      setUsedOptions([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ================= ACTIONS =================

  const handleBudget = () => {
    setShowOptions(false);
    setUsedOptions((prev) => [...prev, "budget"]);

    addMsg("💰 Budget", "user");

    setTimeout(() => {
      addMsg(
        "💰 Budget Information\n\n" +
          "Properties are available across multiple budget ranges in Jabalpur.\n\n" +
          "✔ Affordable Homes & Flats\n" +
          "✔ Mid-Range Residential Properties\n" +
          "✔ Premium Villas & Plots\n\n" +
          "You can explore our property listings to find options that best match your budget and requirements.",
        "bot"
      );
    }, 400);
  };

  const handleLocation = () => {
    setShowOptions(false);
    setUsedOptions((prev) => [...prev, "location"]);

    addMsg("📍 Location", "user");

    setTimeout(() => {
      addMsg(
        "📍 Housify Realty Team – Prime Locations in Jabalpur\n\n" +
          "We deal in verified properties across top areas:\n\n" +
          "• Vijay Nagar\n" +
          "• Wright Town\n" +
          "• Napier Town\n" +
          "• Madan Mahal\n" +
          "• Adhartal\n" +
          "• Tilwara\n" +
          "• Gwarighat\n\n" +
          "Let us know your preferred area for personalized property suggestions.",
        "bot"
      );
    }, 400);
  };

  const handleContact = () => {
    setShowOptions(false);
    setUsedOptions((prev) => [...prev, "contact"]);

    addMsg("📞 Contact", "user");

    setTimeout(() => {
      addMsg(
        "📞 Housify Realty Team – Contact Support\n\n" +
          "We’re here to assist you with verified listings and site visits.\n\n" +
          "🕒 Availability: 8:00 AM – 10:00 PM (Daily)\n\n" +
          "Phone: +91-74159 30089\n" +
          "Email: housifyrealty.info@gmail.com\n\n" +
          "Feel free to reach out anytime — we’re happy to help you.",
        "bot"
      );
    }, 400);
  };

  // ================= UI =================

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <span>HOUSIFY REALTY</span>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="chat-body">
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.sender}`}>
            {msg.text}
          </div>
        ))}

        {showOptions && (
          <div className="options">
            {!usedOptions.includes("budget") && (
              <button onClick={handleBudget}>
                <span>💰 Budget</span>
              </button>
            )}

            {!usedOptions.includes("location") && (
              <button onClick={handleLocation}>
                <span>📍 Location</span>
              </button>
            )}

            {!usedOptions.includes("contact") && (
              <button onClick={handleContact}>
                <span>📞 Contact</span>
              </button>
            )}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>
    </div>
  );
};

export default ChatPopup;