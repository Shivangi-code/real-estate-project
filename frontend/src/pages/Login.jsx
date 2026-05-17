import {
  useState,
  useEffect,
} from "react";

import API from "../utils/api";

import {
  useNavigate,
} from "react-router-dom";

import "../styles/login.css";

// ✅ AUTH CONTEXT
import {
  useAuth,
} from "../context/AuthContext";

export default function Login() {

  // ======================================================
  // ================= MODE ===============================
  // ======================================================

  const [mode, setMode] =
    useState("email-password");

  // ======================================================
  // ================= FORM DATA ==========================
  // ======================================================

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

  const navigate =
    useNavigate();

  // ✅ GLOBAL AUTH
  const {
    login,
    isAuthenticated,
  } = useAuth();

  // ======================================================
  // ================= REDIRECT ===========================
  // ======================================================

  useEffect(() => {

    if (isAuthenticated) {

      const user =
        JSON.parse(
          localStorage.getItem(
            "user"
          )
        );

      if (user?.role === "admin") {

        navigate("/admin");
      }

      else if (
        user?.role === "seller"
      ) {

        navigate("/seller");
      }

      else if (
        user?.role === "builder"
      ) {

        navigate("/builder");
      }

      else {

        navigate("/");
      }
    }

  }, [
    isAuthenticated,
    navigate,
  ]);

  // ======================================================
  // ================= RESET MODE =========================
  // ======================================================

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
      clearInterval(interval);

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
          mode.includes("email") &&
          !data.email
        ) {

          return alert(
            "Enter email"
          );
        }

        if (
          mode.includes("mobile") &&
          !data.mobile
        ) {

          return alert(
            "Enter mobile"
          );
        }

        await API.post(
          "/user-auth/send-otp",

          {
            email:
              data.email ||
              undefined,

            mobile:
              data.mobile ||
              undefined,
          }
        );

        setOtpSent(true);

        setTimer(30);

        alert(
          "OTP sent ✅"
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
  // ================= LOGIN ==============================
  // ======================================================

  const handleLogin =
    async () => {

      try {

        setLoading(true);

        let payload = {
          mode,
        };

        // ================= EMAIL PASSWORD =================

        if (
          mode ===
          "email-password"
        ) {

          if (
            !data.email ||
            !data.password
          ) {

            return alert(
              "Email & password required"
            );
          }

          payload.email =
            data.email;

          payload.password =
            data.password;
        }

        // ================= MOBILE PASSWORD =================

        if (
          mode ===
          "mobile-password"
        ) {

          if (
            !data.mobile ||
            !data.password
          ) {

            return alert(
              "Mobile & password required"
            );
          }

          payload.mobile =
            data.mobile;

          payload.password =
            data.password;
        }

        // ================= EMAIL OTP =================

        if (
          mode ===
          "email-otp"
        ) {

          if (
            !data.email ||
            !data.otp
          ) {

            return alert(
              "Email & OTP required"
            );
          }

          payload.email =
            data.email;

          payload.otp =
            data.otp;
        }

        // ================= MOBILE OTP =================

        if (
          mode ===
          "mobile-otp"
        ) {

          if (
            !data.mobile ||
            !data.otp
          ) {

            return alert(
              "Mobile & OTP required"
            );
          }

          payload.mobile =
            data.mobile;

          payload.otp =
            data.otp;
        }

        // ================= API =================

        const res =
          await API.post(
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
          user.role ===
          "admin"
        ) {

          navigate("/admin");
        }

        else if (
          user.role ===
          "seller"
        ) {

          navigate("/seller");
        }

        else if (
          user.role ===
          "builder"
        ) {

          navigate("/builder");
        }

        else {

          navigate("/");
        }

      } catch (err) {

        alert(
          err.response
            ?.data
            ?.message ||

            "Login failed"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <div className="login-page">

      {/* CARD */}

      <div className="bg-transparent backdrop-blur-2xl border border-white/30 p-8 rounded-3xl w-96 shadow-[0_25px_80px_rgba(0,0,0,0.25)] -mt-[101px]">

        <div className="mb-8">

          <h2 className="housify-title mb-6">
            HOUSIFY
          </h2>

          {/* MODE SWITCH */}

          <div className="grid grid-cols-2 gap-2">

            {[
              [
                "email-password",
                "Email",
              ],

              [
                "mobile-password",
                "Mobile",
              ],

              [
                "email-otp",
                "Email OTP",
              ],

              [
                "mobile-otp",
                "Mobile OTP",
              ],
            ].map(
              ([
                key,
                label,
              ]) => (

                <button
                  key={key}

                  onClick={() =>
                    setMode(key)
                  }

                  className={`premium-tab ${
                    mode === key
                      ? "active"
                      : ""
                  }`}
                >
                  {label}
                </button>
              )
            )}

          </div>

        </div>

        {/* EMAIL */}

        {mode.includes("email") && (

          <input
            name="email"
            placeholder="Enter Email"
            value={data.email}
            onChange={handleChange}
            className="premium-input mb-3"
          />
        )}

        {/* MOBILE */}

        {mode.includes("mobile") && (

          <input
            name="mobile"
            placeholder="Enter Mobile"
            value={data.mobile}
            onChange={handleChange}
            className="premium-input mb-3"
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
            className="premium-input mb-3"
          />
        )}

        {/* OTP */}

        {mode.includes("otp") && (

          <div className="premium-otp-wrapper mb-4">

            <input
              name="otp"
              placeholder="Enter OTP"
              value={data.otp}
              onChange={handleChange}
              className="premium-otp"
            />

            <button
              onClick={sendOtp}

              disabled={
                timer > 0
              }

              className={`absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md text-sm text-white ${
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
        )}

        {/* LOGIN BUTTON */}

        <button
          onClick={handleLogin}

          disabled={loading}

          className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg hover:scale-[1.02] transition"
        >

          {loading
            ? "Logging in..."
            : "Login"}

        </button>

        {/* LINKS */}

        <div className="mt-6 flex flex-col gap-2 text-center text-sm">

          <button
            onClick={() =>
              navigate("/signup")
            }

            className="text-white/80 hover:text-blue-300 transition hover:underline"
          >
            Create Account
          </button>

          <button
            onClick={() =>
              navigate(
                "/forgot-password"
              )
            }

            className="text-white/80 hover:text-blue-300 transition hover:underline"
          >
            Forgot Password
          </button>

        </div>

      </div>

    </div>
  );
}