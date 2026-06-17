import { useState, useEffect } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/forgotpassword.css";

export default function ForgotPassword() {

  const [data, setData] = useState({
    email: "",
    mobile: "",
    otp: "",
    newPassword: "",
  });

  const [timer, setTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // TIMER
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // SEND OTP
  const sendOtp = async () => {
    try {
      if (!data.email && !data.mobile) {
        return alert("Enter email or mobile");
      }

      await API.post("/user-auth/send-otp", {
        email: data.email || undefined,
        mobile: data.mobile || undefined,
      });

      setOtpSent(true);
      setTimer(60);

      alert("OTP sent ✅");

    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // RESET PASSWORD
  const handleReset = async () => {
    try {
      if (!data.otp || !data.newPassword) {
        return alert("OTP & new password required");
      }

      setLoading(true);

      await API.post("/user-auth/reset-password", data);

      alert("Password updated 🎉");

      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">

      <div className="forgot-container">

        {/* TITLE */}
        <h2 className="forgot-title">
          RESET PASSWORD
        </h2>

        {/* EMAIL */}
        <input
          name="email"
          placeholder="Email (optional)"
          value={data.email}
          onChange={handleChange}
          className="forgot-input"
        />

        {/* MOBILE */}
        <input
          name="mobile"
          placeholder="Mobile"
          value={data.mobile}
          onChange={handleChange}
          className="forgot-input"
        />

        {/* OTP */}
        <div className="otp-wrapper">

          <input
            name="otp"
            placeholder="Enter OTP"
            value={data.otp}
            onChange={handleChange}
            className="forgot-input otp-input"
          />

          <button
            onClick={sendOtp}
            disabled={timer > 0}
            className={`otp-btn ${
              timer > 0 ? "disabled" : ""
            }`}
          >
            {timer > 0
              ? `Resend ${timer}s`
              : otpSent
              ? "Resend OTP"
              : "Send OTP"}
          </button>

        </div>

        {/* NEW PASSWORD */}
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={data.newPassword}
          onChange={handleChange}
          className="forgot-input"
        />

        {/* BUTTON */}
        <button
          onClick={handleReset}
          disabled={loading}
          className="reset-btn"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

        {/* LOGIN LINK */}
        <p className="forgot-bottom">
          Back to{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

      </div>

    </div>
  );
}