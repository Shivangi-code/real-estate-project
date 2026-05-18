import {
  useState,
  useEffect,
} from "react";

import API from "../utils/api";

import {
  useNavigate,
} from "react-router-dom";

import "../styles/signup.css";

export default function Signup() {

  const [data, setData] =
    useState({
      name: "",
      email: "",
      mobile: "",
      password: "",
      otp: "",
      role: "buyer",
    });

  const [loading, setLoading] =
    useState(false);

  const [otpSent, setOtpSent] =
    useState(false);

  const [timer, setTimer] =
    useState(0);

  const navigate =
    useNavigate();

  // ======================================================
  // ================= TIMER ==============================
  // ======================================================

  useEffect(() => {

    let interval;

    if (timer > 0) {

      interval =
        setInterval(() => {

          setTimer(
            (prev) =>
              prev - 1
          );

        }, 1000);
    }

    return () =>
      clearInterval(
        interval
      );

  }, [timer]);

  // ======================================================
  // ================= INPUT ==============================
  // ======================================================

  const handleChange =
    (e) => {

      setData({
        ...data,

        [e.target.name]:
          e.target.value,
      });
    };

  // ======================================================
  // ================= SEND OTP ===========================
  // ======================================================

  const sendOtp =
    async () => {

      try {

        if (
          !data.mobile
        ) {

          return alert(
            "Mobile number required"
          );
        }

        await API.post(
          "/user-auth/register-send-otp",

          {
            mobile:
              data.mobile,
          }
        );

        setOtpSent(true);

        setTimer(30);

        alert(
          "OTP sent successfully ✅"
        );

      } catch (err) {

        alert(
          err.response
            ?.data
            ?.message ||

            "Failed to send OTP"
        );
      }
    };

  // ======================================================
  // ================= SIGNUP =============================
  // ======================================================

  const handleSignup =
    async () => {

      try {

        if (
          !data.name ||
          !data.mobile ||
          !data.password ||
          !data.otp
        ) {

          return alert(
            "All required fields must be filled"
          );
        }

        setLoading(true);

        await API.post(
          "/user-auth/register",

          {
            name:
              data.name,

            email:
              data.email,

            mobile:
              data.mobile,

            password:
              data.password,

            otp:
              data.otp,

            role:
              data.role,
          }
        );

        alert(
          `Signup successful as ${data.role} 🎉`
        );

        navigate(
          "/login"
        );

      } catch (err) {

        alert(
          err.response
            ?.data
            ?.message ||

            "Signup failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="signup-page">

      {/* ORBS */}

      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>

      {/* LIGHT LINES */}

      <div className="light-line line1"></div>
      <div className="light-line line2"></div>
      <div className="light-line line3"></div>

      {/* FLOATING LABELS */}

      <div className="floating-card card1">
        📍 Jabalpur Plots
      </div>

      <div className="floating-card card2">
        🏡 1BHK • 2BHK • 3BHK
      </div>

      <div className="floating-card card3">
        🌿 Premium Plots
      </div>

      <div className="floating-card card4">
        🔑 Find Your Dream Home
      </div>

      {/* CARD */}

      <div className="signup-container">

        {/* TITLE */}

        <div className="text-center mb-3">

          <div className="house-icon">
            🏠
          </div>

          <h2 className="signup-title">
            CREATE ACCOUNT
          </h2>

          <p className="signup-subtitle">
            Find Your Dream Property
          </p>

        </div>

        {/* NAME */}

        <div className="mb-2">

          <label className="text-white text-sm mb-1 block">

            Full Name

            <span className="text-red-400 ml-1 animate-pulse">
              *
            </span>

          </label>

          <input
            name="name"
            placeholder="Enter Full Name"
            value={data.name}
            onChange={handleChange}
            className="signup-input"
          />

        </div>

        {/* EMAIL */}

        <div className="mb-2">

          <label className="text-white text-sm mb-1 block">
            Email
          </label>

          <input
            name="email"
            placeholder="Enter Email"
            value={data.email}
            onChange={handleChange}
            className="signup-input"
          />

        </div>

        {/* MOBILE */}

        <div className="mb-2">

          <label className="text-white text-sm mb-1 block">

            Mobile Number

            <span className="text-red-400 ml-1 animate-pulse">
              *
            </span>

          </label>

          <input
            name="mobile"
            placeholder="Enter Mobile Number"
            value={data.mobile}
            onChange={handleChange}
            className="signup-input"
          />

        </div>

        {/* OTP */}

        <div className="relative mb-4">

          <input
            name="otp"
            placeholder="Enter OTP"
            value={data.otp}
            onChange={handleChange}
            className="w-full p-4 pr-32 rounded-2xl bg-white/20 text-white placeholder-white outline-none"
          />

          <button
            onClick={sendOtp}

            disabled={
              timer > 0
            }

            className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl text-sm text-white ${
              timer > 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >

            {timer > 0
              ? `Resend ${timer}s`
              : otpSent
              ? "Resend OTP"
              : "Send OTP"}

          </button>

        </div>

        {/* PASSWORD */}

        <div className="mb-2">

          <label className="text-white text-sm mb-1 block">

            Password

            <span className="text-red-400 ml-1 animate-pulse">
              *
            </span>

          </label>

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={data.password}
            onChange={handleChange}
            className="signup-input"
          />

        </div>

        {/* ROLE */}

        <div className="mb-3">

          <label className="text-white text-sm mb-1 block">

            Select Role

            <span className="text-red-400 ml-1 animate-pulse">
              *
            </span>

          </label>

          <select
            name="role"
            value={data.role}
            onChange={handleChange}
            className="signup-input"
          >

            <option
              value="buyer"
              className="text-black"
            >
              Buyer
            </option>

            <option
              value="seller"
              className="text-black"
            >
              Seller
            </option>

            <option
              value="builder"
              className="text-black"
            >
              Builder
            </option>

          </select>

        </div>

        {/* BUTTON */}

        <button
          onClick={handleSignup}

          disabled={loading}

          className="w-full bg-white text-black font-semibold py-2.5 rounded-xl hover:scale-105 transition"
        >

          {loading
            ? "Creating..."
            : "Create Account"}

        </button>

        {/* LOGIN */}

        <p className="text-center text-white text-sm mt-3">

          Already have an account?{" "}

          <span
            onClick={() =>
              navigate("/login")
            }

            className="underline cursor-pointer hover:text-blue-200 transition"
          >
            Login
          </span>

        </p>

      </div>

    </div>
  );
}