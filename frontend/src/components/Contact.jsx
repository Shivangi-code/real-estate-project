import { useState } from "react";
import "../styles/Contact.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [success, setSuccess] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      // ✅ Safe response check
      if (res.ok) {
        setSuccess(
        "Message Sent Successfully!  "
          );
        setForm({ name: "", email: "", message: "" });
      } else {
        setSuccess("❌ Error sending message");
      }

    } catch (error) {
      console.error(error);
      setSuccess("❌ Server not running or network error");
    }

    // Auto hide message
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>

      {success && <p className="success-msg">{success}</p>}

      <form className="contact-form" onSubmit={handleSubmit}>
        
        <input
          type="text"
          name="name"
          value={form.name}
          placeholder="Your Name"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          value={form.email}
          placeholder="Your Email"
          onChange={handleChange}
          required
        />

        <textarea
          name="message"
          value={form.message}
          placeholder="Your Message"
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">Send Message 🚀</button>
      </form>
    </div>
  );
}

export default Contact;