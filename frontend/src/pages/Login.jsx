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

import PremiumPopup from "../components/PremiumPopup";

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
  
  const [popup, setPopup] = useState({
  show: false,
  type: "success",
  title: "",
  message: "",
});

  const navigate =
    useNavigate();

  const {
    login,
    isAuthenticated,
  } = useAuth();

  // ======================================================
  // ENTER KEY LOGIN
  // ======================================================

  useEffect(() => {

    const handleKeyDown = (e) => {

      if (e.key === "Enter") {

        handleLogin();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };

  }, [data, mode]);

  // ======================================================
  // REDIRECT
  // ======================================================

  useEffect(() => {

    if (isAuthenticated) {

      const user =
        JSON.parse(
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

  // ======================================================
  // RESET MODE
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
  // TIMER
  // ======================================================

  useEffect(() => {

    let interval;

    if (timer > 0) {

      interval =
        setInterval(() => {

          setTimer((prev) => prev - 1);

        }, 1000);
    }

    return () => clearInterval(interval);

  }, [timer]);

  // ======================================================
  // INPUT
  // ======================================================

  const handleChange = (e) => {

    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const showPopup = (
  type,
  title,
  message
) => {
  setPopup({
    show: true,
    type,
    title,
    message,
  });
};
  // ======================================================
  // SEND OTP
  // ======================================================

  const sendOtp = async () => {

    try {

      if (!data.mobile) {

        return alert(
          "Enter mobile number"
        );
      }

      setLoading(true);

      await API.post(
        "/user-auth/send-otp",
        {
          mobile: data.mobile,
        }
      );

      setOtpSent(true);

      setTimer(60);

      showPopup(
  "success",
  "OTP Sent",
  "OTP sent successfully"
);

    } catch (err) {

      showPopup(
  "error",
  "OTP Failed",
  err.response?.data?.message ||
  "Failed to send OTP"
);

    } finally {

      setLoading(false);
    }
  };

  // ======================================================
  // LOGIN
  // ======================================================

  const handleLogin = async () => {

    try {

      setLoading(true);

      let payload = { mode };

      if (mode === "email-password") {

        if (
          !data.email ||
          !data.password
        ) {

          return alert(
            "Email & password required"
          );
        }

        payload.email = data.email;

        payload.password = data.password;
      }

      if (mode === "mobile-password") {

        if (
          !data.mobile ||
          !data.password
        ) {

    return showPopup(
"warning",
"Mobile Required",
"Please enter mobile number"
);
        }

        payload.mobile = data.mobile;

        payload.password = data.password;
      }

      if (mode === "mobile-otp") {

        if (
          !data.mobile ||
          !data.otp
        ) {

          return alert(
            "Mobile & OTP required"
          );
        }

        payload.mobile = data.mobile;

        payload.otp = data.otp;
      }

      const res =
        await API.post(
          "/user-auth/login",
          payload
        );

      const {
        token,
        user,
      } = res.data;

      login(user, token);

      if (user.role === "admin") {
        navigate("/admin");
      }

      else if (user.role === "seller") {
        navigate("/seller");
      }

      else if (user.role === "builder") {
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

      <div
        className="
          bg-transparent
          backdrop-blur-2xl
          border
          border-white/30

          rounded-[28px]

          w-full
          max-w-md

          px-4
          py-6

          sm:px-7
          sm:py-8

          shadow-[0_25px_80px_rgba(0,0,0,0.25)]

          mx-auto
        "
      >

        {/* ================= TITLE ================= */}

        <div className="mb-6 sm:mb-8">

          <h2 className="housify-title mb-5 sm:mb-6">
            HOUSIFY
          </h2>

          {/* ================= MODES ================= */}

          <div className="grid grid-cols-3 gap-2">

            {[
              ["email-password", "Email"],
              ["mobile-password", "Mobile"],
              ["mobile-otp", "OTP"],
            ].map(([key, label]) => (

              <button
                key={key}
                onClick={() => setMode(key)}
                className={`premium-tab ${
                  mode === key
                    ? "active"
                    : ""
                }`}
              >
                {label}
              </button>

            ))}

          </div>

        </div>

        {/* ================= EMAIL ================= */}

        {mode === "email-password" && (

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={data.email}
            onChange={handleChange}
            className="premium-input mb-3"
          />
        )}

        {/* ================= MOBILE ================= */}

        {(mode === "mobile-password" ||
          mode === "mobile-otp") && (

          <input
            type="tel"
            name="mobile"
            placeholder="Enter Mobile"
            value={data.mobile}
            onChange={handleChange}
            className="premium-input mb-3"
          />
        )}

        {/* ================= PASSWORD ================= */}

        {(mode === "email-password" ||
          mode === "mobile-password") && (

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={data.password}
            onChange={handleChange}
            className="premium-input mb-3"
          />
        )}

        {/* ================= OTP ================= */}

        {mode === "mobile-otp" && (

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
                timer > 0 || loading
              }

              className={`
                absolute
                right-2
                top-1/2
                -translate-y-1/2

                px-2
                py-1

                sm:px-3

                rounded-md

                text-[11px]
                sm:text-sm

                text-white

                transition-all

                ${
                  timer > 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              `}
            >

              {timer > 0
                ? `Resend ${timer}s`
                : otpSent
                ? "Resend OTP"
                : "Send OTP"}

            </button>

          </div>
        )}

        {/* ================= LOGIN BUTTON ================= */}

        <button
          onClick={handleLogin}

          disabled={loading}

          className="premium-btn"
        >

          {loading
            ? "Please wait..."
            : "Login"}

        </button>

        {/* ================= BOTTOM LINKS ================= */}

        <div
          className="
            flex
            flex-col

            sm:flex-row

            justify-between

            items-start
            sm:items-center

            gap-3

            mt-5

            text-[13px]
            sm:text-sm

            text-white
          "
        >

          <span
            onClick={() =>
              navigate("/signup")
            }

            className="
              cursor-pointer
              hover:underline
            "
          >
            Create Account
          </span>

          <span
            onClick={() =>
              navigate("/forgot-password")
            }

            className="
              cursor-pointer
              hover:underline
            "
          >
            Forgot Password?
          </span>

        </div>

      </div>

          <PremiumPopup
        show={popup.show}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        onClose={() =>
          setPopup((prev) => ({
            ...prev,
            show: false,
          }))
        }
      />

    </div>
  );
}