import { useState, useEffect } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

// ✅ AUTH CONTEXT
import { useAuth } from "../context/AuthContext";

export default function Login() {

  const [mode, setMode] =
    useState("email-password");

  const [data, setData] =
    useState({
      email: "",
      mobile: "",
      password: "",
      otp: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [otpSent, setOtpSent] =
    useState(false);

  const [timer, setTimer] =
    useState(0);

  const navigate = useNavigate();

  // ✅ GLOBAL AUTH
  const { login, isAuthenticated } =
    useAuth();

  // ================= REDIRECT IF ALREADY LOGGED IN =================
  useEffect(() => {

    if (isAuthenticated) {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (user?.role === "admin") {
        navigate("/admin");
      }

      else if (user?.role === "seller") {
        navigate("/seller");
      }

      else if (user?.role === "builder") {
        navigate("/builder");
      }

      else {
        navigate("/");
      }
    }

  }, [isAuthenticated, navigate]);

  // ================= RESET ON MODE CHANGE =================
  useEffect(() => {

    setData({
      email: "",
      mobile: "",
      password: "",
      otp: "",
    });

    setOtpSent(false);

    setTimer(0);

  }, [mode]);

  // ================= TIMER =================
  useEffect(() => {

    let interval;

    if (timer > 0) {

      interval = setInterval(() => {

        setTimer((prev) => prev - 1);

      }, 1000);
    }

    return () => clearInterval(interval);

  }, [timer]);

  // ================= INPUT =================
  const handleChange = (e) => {

    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SEND OTP =================
  const sendOtp = async () => {
    try {

      if (
        mode.includes("email") &&
        !data.email
      ) {
        return alert("Enter email");
      }

      if (
        mode.includes("mobile") &&
        !data.mobile
      ) {
        return alert(
          "Enter mobile number"
        );
      }

      await API.post(
        "/user-auth/send-otp",
        {
          email:
            data.email || undefined,

          mobile:
            data.mobile || undefined,
        }
      );

      setOtpSent(true);

      setTimer(30);

      alert("OTP sent ✅");

    } catch (err) {

      alert(
        err.response?.data?.message ||
          "Failed to send OTP"
      );
    }
  };

  // ================= LOGIN =================
  const handleLogin = async () => {

    try {

      // ================= VALIDATION =================

      if (
        mode === "email-password"
      ) {

        if (
          !data.email ||
          !data.password
        ) {
          return alert(
            "Email & password required"
          );
        }
      }

      if (
        mode === "mobile-password"
      ) {

        if (
          !data.mobile ||
          !data.password
        ) {
          return alert(
            "Mobile & password required"
          );
        }
      }

      if (
        mode === "email-otp"
      ) {

        if (
          !data.email ||
          !data.otp
        ) {
          return alert(
            "Email & OTP required"
          );
        }
      }

      if (
        mode === "mobile-otp"
      ) {

        if (
          !data.mobile ||
          !data.otp
        ) {
          return alert(
            "Mobile & OTP required"
          );
        }
      }

      setLoading(true);

      let payload = { mode };

      // ================= BUILD PAYLOAD =================

      if (
        mode === "email-password"
      ) {

        payload.email =
          data.email;

        payload.password =
          data.password;
      }

      if (
        mode === "mobile-password"
      ) {

        payload.mobile =
          data.mobile;

        payload.password =
          data.password;
      }

      if (
        mode === "email-otp"
      ) {

        payload.email =
          data.email;

        payload.otp =
          data.otp;
      }

      if (
        mode === "mobile-otp"
      ) {

        payload.mobile =
          data.mobile;

        payload.otp =
          data.otp;
      }

      // ================= API =================

      const res = await API.post(
        "/user-auth/login",
        payload
      );

      const {
        token,
        refreshToken,
        user,
      } = res.data;

      // ✅ GLOBAL LOGIN
      login(
        user,
        token,
        refreshToken
      );

      // ================= REDIRECT =================

      if (
        user.role === "admin"
      ) {

        navigate("/admin");
      }

      else if (
        user.role === "seller"
      ) {

        navigate("/seller");
      }

      else if (
        user.role === "builder"
      ) {

        navigate("/builder");
      }

      else {

        navigate("/");
      }

    } catch (err) {

      alert(
        err.response?.data?.message ||
          "Login failed"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="login-page">

      <div className="backdrop-blur-xl bg-white/15 border border-white/30 p-8 rounded-3xl w-96 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">

        {/* TITLE */}
        <h2 className="housify-title">
          HOUSIFY
        </h2>

        {/* MODE SWITCH */}
        <div className="grid grid-cols-2 gap-2 mb-4">

          {[
            ["email-password", "Email"],
            ["mobile-password", "Mobile"],
            ["email-otp", "Email OTP"],
            ["mobile-otp", "Mobile OTP"],
          ].map(([key, label]) => (

            <button
              key={key}
              onClick={() =>
                setMode(key)
              }
              className={`p-2 rounded text-white ${
                mode === key
                  ? "bg-blue-600"
                  : "bg-white/20"
              }`}
            >
              {label}
            </button>

          ))}
        </div>

        {/* EMAIL */}
        {mode.includes("email") && (
          <input
            name="email"
            placeholder="Enter Email"
            value={data.email}
            onChange={handleChange}
            className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white placeholder-white outline-none"
          />
        )}

        {/* MOBILE */}
        {mode.includes("mobile") && (
          <input
            name="mobile"
            placeholder="Enter Mobile"
            value={data.mobile}
            onChange={handleChange}
            className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white placeholder-white outline-none"
          />
        )}

        {/* PASSWORD */}
        {mode.includes("password") && (
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={data.password}
            onChange={handleChange}
            className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white placeholder-white outline-none"
          />
        )}

        {/* OTP */}
        {mode.includes("otp") && (
          <div className="relative mb-4">

            <input
              name="otp"
              placeholder="Enter OTP"
              value={data.otp}
              onChange={handleChange}
              className="w-full p-3 pr-32 rounded-lg bg-white/20 text-white placeholder-white outline-none"
            />

            <button
              onClick={sendOtp}
              disabled={timer > 0}
              className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md text-sm ${
                timer > 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {timer > 0
                ? `Resend ${timer}s`
                : otpSent
                ? "Resend OTP"
                : "Send OTP"}
            </button>
          </div>
        )}

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:scale-105 transition"
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        {/* LINKS */}
        <div className="text-center mt-4 text-white text-sm space-y-2">

          <p
            className="cursor-pointer underline hover:text-blue-200 transition"
            onClick={() =>
              navigate("/signup")
            }
          >
            Create Account
          </p>

          <p
            className="cursor-pointer underline hover:text-blue-200 transition"
            onClick={() =>
              navigate(
                "/forgot-password"
              )
            }
          >
            Forgot Password
          </p>

        </div>
      </div>
    </div>
  );
}