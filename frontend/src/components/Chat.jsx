import { useState } from "react";
import "../styles/Chat.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const sendMessage = () => {
    if (!input) return;

    const newMsg = { text: input, sender: "user" };
    setMessages([...messages, newMsg]);
    setInput("");

    // fake bot reply
    setTyping(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {  text: "Thanks for your message! 😊\nFor more details, call us 📞 7415930089 or chat on WhatsApp 💬",
      sender: "bot",},
      ]);
      setTyping(false);
    }, 1000);
  };

  return (
    <div className="chat-container">
      <h2>Chat Support 💬</h2>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}

        {typing && <p className="typing">Typing...</p>}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;