import React, { useEffect, useState } from "react";
import "../styles/footer.css";

function Footer() {
  const year = new Date().getFullYear();

  /* 📊 Stats Counter */
  const [plots, setPlots] = useState(0);
  const [clients, setClients] = useState(0);

  /* 🎉 Easter Egg */
  const [clickCount, setClickCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

  /* 📊 Counter Animation */
  useEffect(() => {
    let p = 0;
    let c = 0;

    const interval = setInterval(() => {
      if (p < 100) p += 2;
      if (c < 200) c += 4;

      setPlots(p);
      setClients(c);

      if (p >= 100 && c >= 200) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  /* 🌌 Mouse Glow */
  useEffect(() => {
    const footer = document.querySelector(".footer");

    const handleMouseMove = (e) => {
      const rect = footer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      footer.style.setProperty("--x", `${x}px`);
      footer.style.setProperty("--y", `${y}px`);
    };

    footer.addEventListener("mousemove", handleMouseMove);
    return () => footer.removeEventListener("mousemove", handleMouseMove);
  }, []);

  /* 🎯 Scroll Reveal */
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));
  }, []);

  /* 🎉 Easter Egg Click */
  const handleLogoClick = () => {
    const count = clickCount + 1;
    setClickCount(count);

    if (count === 5) {
      setShowSecret(true);
      setTimeout(() => setShowSecret(false), 3000);
      setClickCount(0);
    }
  };

  /* 🔼 Scroll to Top */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">

      {/* 🌌 Mouse Glow */}
      <div className="mouse-glow"></div>

      {/* 🌌 Particles */}
      <div className="particles">
        {Array.from({ length: 25 }).map((_, i) => (
          <span key={i}></span>
        ))}
      </div>

      {/* 🎉 Secret Popup */}
      {showSecret && (
        <div className="secret-popup">
          🏠 One step closer to the place you'll call home.
        </div>
      )}

      {/* 🔹 Brand */}
      <div className="footer-brand-center reveal">
        <div className="brand-text">
          <h2 className="logo-main" onClick={handleLogoClick}>
            Housify
          </h2>
          <p className="logo-sub">REALTY</p>
        </div>

        <p className="dynamic-text">
          Your dream home starts here.
        </p>
      </div>

      {/* 🔹 Main Sections */}
      <div className="footer-container">

        <div className="footer-section reveal">
          <h3>Quick Links</h3>
          <div className="footer-links">
            <a href="/">Home</a>
            <a href="/properties">Properties</a>
            <a href="/about">About</a>
            <a href="/login">Login</a>
          </div>
        </div>

        <div className="footer-section reveal">
          <h3>Contact</h3>
          <p>📍 Jabalpur, India</p>
          <p>📞 7415930089</p>
          <p>📧 nehakarna014@gmail.com</p>
        </div>

        <div className="footer-section reveal">
          <h3>FAQ</h3>
          <div className="footer-links">
            <p>✔ What services do you provide?</p>
            <p>✔ Are properties verified?</p>
            <p>✔ Do you offer loan help?</p>
            <a href="/faq">View All FAQs →</a>
          </div>
        </div>

        <div className="footer-section reveal">
          <h3>Subscribe</h3>
          <div className="newsletter">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>

      </div>

      {/* 🔥 Stats */}
      <div className="footer-stats reveal">
        <div className="stat-box">
          <h4>{plots}+</h4>
          <p>Plots Sold</p>
        </div>

        <div className="stat-box">
          <h4>{clients}+</h4>
          <p>Happy Clients</p>
        </div>

        <div className="stat-box">
          <h4>JABALPUR</h4>
          <p>City</p>
        </div>
      </div>

      {/* 🔹 Social */}
      <div className="footer-social reveal">
        <a
          href="https://instagram.com/hltproperties_jabalpur"
          target="_blank"
          rel="noreferrer"
        >
          <i className="fab fa-instagram"></i>
        </a>
      </div>

      {/* 🔹 Bottom */}
      <div className="footer-bottom reveal">
        <p>© {year} Housify. All rights reserved.</p>
      </div>

      {/* 🔼 Scroll Button */}
      <button className="scroll-top" onClick={scrollToTop}>
        ↑
      </button>

      {/* 🌊 Wave */}
      <div className="footer-wave"></div>

    </footer>
  );
}

export default Footer;
