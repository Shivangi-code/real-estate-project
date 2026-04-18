import { useState, useEffect } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

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
      setTimer(30);

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
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-red-500 via-pink-500 to-purple-600">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl w-96 shadow-2xl">

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Reset Password
        </h2>

        {/* EMAIL */}
        <input
          name="email"
          placeholder="Email (optional)"
          value={data.email}
          onChange={handleChange}
          className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white placeholder-white outline-none"
        />

        {/* MOBILE */}
        <input
          name="mobile"
          placeholder="Mobile (optional)"
          value={data.mobile}
          onChange={handleChange}
          className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white placeholder-white outline-none"
        />

        {/* OTP */}
        <div className="relative mb-3">
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
                : "bg-red-600 hover:bg-red-700"
            } text-white`}
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
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-white outline-none"
        />

        {/* RESET BUTTON */}
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:scale-105 transition"
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

        <p className="text-center text-white text-sm mt-4">
          Back to{" "}
          <span
            onClick={() => navigate("/login")}
            className="underline cursor-pointer"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}