import React, { useEffect, useState } from "react";
import "../styles/footer.css";

function Footer() {
  const year = new Date().getFullYear();

  /* 🎉 Easter Egg */
  const [clickCount, setClickCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

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

    return () => observer.disconnect();
  }, []);

  /* 🎉 Easter Egg Click */
  const handleLogoClick = () => {
    const count = clickCount + 1;
    setClickCount(count);

    if (count === 5) {
      setShowSecret(true);

      setTimeout(() => {
        setShowSecret(false);
      }, 3000);

      setClickCount(0);
    }
  };

  /* 🔼 Scroll to Top */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">

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
          <h2
            className="logo-main"
            onClick={handleLogoClick}
          >
            Housify
          </h2>

          <p className="logo-sub">
            REALTY
          </p>
        </div>

        <p className="dynamic-text">
          Your dream home starts here.
        </p>
      </div>

      {/* 🔹 Main Sections */}
      <div className="footer-container">

        {/* QUICK LINKS */}
        <div className="footer-section reveal">
          <h3>Quick Links</h3>

          <div className="footer-links">
            <a href="/">Home</a>
            <a href="/properties">Properties</a>
            <a href="/about">About</a>
            <a href="/login">Login</a>
          </div>
        </div>

        {/* CONTACT */}
        <div className="footer-section reveal">
          <h3>Contact</h3>

          <p>📍 Jabalpur, India</p>
          <p>📞 +91-7415930089</p>
          <p>📧 housifyrealty.info@gmail.com</p>
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
      <div className="footer-bottom">
        <p>
          © {year} Housify. All rights reserved.
        </p>
      </div>

      {/* 🔼 Scroll Button */}
      <button
        className="scroll-top"
        onClick={scrollToTop}
      >
        ⌃
      </button>

      {/* 🌊 Wave */}
      <div className="footer-wave"></div>

    </footer>
  );
}

export default Footer;