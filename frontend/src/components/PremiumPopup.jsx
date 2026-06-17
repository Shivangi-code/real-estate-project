import { useEffect } from "react";
import "../styles/premiumPopup.css";

export default function PremiumPopup({
  show,
  type = "success",
  title = "",
  message = "",
  onClose,
}) {
  useEffect(() => {
  if (!show) return;

  const timer = setTimeout(() => {
    onClose?.();
  }, 2000);

  return () => clearTimeout(timer);
}, [show]);

if (!show) {
  return null;
}

  const icons = {
    success: "✓",
    error: "✕",
    warning: "!",
    info: "i",
  };

  return (
    <div className="premium-popup-overlay">
      <div className={`premium-popup-card ${type}`}>

        <div className="premium-popup-border"></div>

        <div className="premium-popup-icon">
          {icons[type]}
        </div>

        <h3 className="premium-popup-title">
          {title}
        </h3>

        <p className="premium-popup-message">
          {message}
        </p>

      </div>
    </div>
  );
}
