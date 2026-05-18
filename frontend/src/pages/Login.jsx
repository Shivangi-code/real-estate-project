import {
  useState,
  useEffect,
} from "react";

import API from "../utils/api";

import {
  useNavigate,
} from "react-router-dom";

import "../styles/login.css";

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
            (
              prev
            ) =>
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
            "Enter mobile number"
          );
        }

        setLoading(true);

        await API.post(
          "/user-auth/send-otp",

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

      } finally {

        setLoading(false);
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

        // ======================================================
        // ================= EMAIL PASSWORD =====================
        // ======================================================

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

        // ======================================================
        // ================= MOBILE PASSWORD ====================
        // ======================================================

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

        // ======================================================
        // ================= MOBILE OTP =========================
        // ======================================================

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

        // ======================================================
        // ================= API ================================
        // ======================================================

        const res =
          await API.post(
            "/user-auth/login",
            payload
          );

        const {
          token,
          user,
        } = res.data;

        login(
          user,
          token
        );

        // ======================================================
        // ================= REDIRECT ===========================
        // ======================================================

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

      <div className="bg-transparent backdrop-blur-2xl border border-white/30 p-8 rounded-3xl w-96 shadow-[0_25px_80px_rgba(0,0,0,0.25)] -mt-[101px]">

        <div className="mb-8">

          <h2 className="housify-title mb-6">
            HOUSIFY
          </h2>

          {/* MODE SWITCH */}

          <div className="grid grid-cols-3 gap-2">

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
                "mobile-otp",
                "OTP",
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

        {mode ===
          "email-password" && (

          <input
            name="email"
            placeholder="Enter Email"
            value={data.email}
            onChange={handleChange}
            className="premium-input mb-3"
          />
        )}

        {/* MOBILE */}

        {(mode ===
          "mobile-password" ||

          mode ===
            "mobile-otp") && (

          <input
            name="mobile"
            placeholder="Enter Mobile"
            value={data.mobile}
            onChange={handleChange}
            className="premium-input mb-3"
          />
        )}

        {/* PASSWORD */}

        {(mode ===
          "email-password" ||

          mode ===
            "mobile-password") && (

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

        {mode ===
          "mobile-otp" && (

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
                timer > 0 ||
                loading
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
          onClick={
            handleLogin
          }

          disabled={
            loading
          }

          className="premium-btn"
        >

          {loading
            ? "Please wait..."
            : "Login"}

        </button>

        {/* LINKS */}

        <div className="flex justify-between mt-5 text-sm text-white">

          <span
            onClick={() =>
              navigate(
                "/signup"
              )
            }
            className="cursor-pointer hover:underline"
          >
            Create Account
          </span>

          <span
            onClick={() =>
              navigate(
                "/forgot-password"
              )
            }
            className="cursor-pointer hover:underline"
          >
            Forgot Password?
          </span>

        </div>

      </div>

    </div>
  );
}