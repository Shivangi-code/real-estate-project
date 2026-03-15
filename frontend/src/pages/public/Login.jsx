import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "../../styles/login.css";

const Login = () => {

  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  // SEND OTP
  const handleSendOtp = async () => {

    try {

      const res = await fetch("http://localhost:5000/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          mobile
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert("OTP sent ✅ (Check backend console)");
        setStep(2);
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error("Send OTP error:", err);
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async () => {

    try {

      const res = await fetch("http://localhost:5000/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mobile,
          otp
        })
      });

      const data = await res.json();

      if (res.ok) {

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        const role = data.role;
        const userType = localStorage.getItem("userType");

        let redirectPath = "/";

        if (role === "buyer" || userType === "buyer") {
          redirectPath = "/";
        }
        else if (role === "seller") {
          redirectPath = "/add-property";
        }
        else if (role === "agent") {
          redirectPath = "/agent";
        }
        else if (role === "builder") {
          redirectPath = "/builder";
        }
        else if (role === "admin") {
          redirectPath = "/admin";
        }

        navigate(redirectPath, { replace: true });

      } else {
        alert(data.message || "OTP verification failed");
      }

    } catch (err) {
      console.error("Verify OTP error:", err);
    }
  };

  return (

    <div className="login-page">

      <div className="login-card">

        {/* LOGO */}
        <img src={logo} alt="Housify" className="login-logo" />

        <h2>Login to Housify</h2>

        {step === 1 && (
          <>
            <input
              className="login-input"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              className="login-input"
              placeholder="Enter Mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            <button
              className="login-btn-main"
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="otp-info">
              Enter the OTP sent to your mobile
            </p>

            <input
              className="login-input"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              className="login-btn-main"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>
          </>
        )}

      </div>

    </div>

  );
};

export default Login;