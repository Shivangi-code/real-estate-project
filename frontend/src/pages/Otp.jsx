import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Otp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const mobile = localStorage.getItem("mobile");

  const handleVerify = async () => {
    try {
      // ✅ Validation
      if (!otp) {
        return alert("Enter OTP");
      }

      if (!mobile) {
        return alert("Mobile not found. Please login again.");
      }

      setLoading(true);

      const res = await API.post("/user-auth/verify-otp", {
        mobile,
        otp,
      });

      // ✅ Safety check
      if (!res.data || !res.data.user) {
        throw new Error("Invalid server response");
      }

      // ✅ Store tokens
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;

      // ✅ Role redirect
      if (role === "admin") navigate("/admin");
      else if (role === "seller") navigate("/seller");
      else if (role === "agent") navigate("/agent");
      else if (role === "builder") navigate("/builder");
      else navigate("/");

    } catch (err) {
      console.error("OTP Error:", err);

      // ✅ Handle both msg & message
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        "Invalid OTP";

      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-600">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl w-96 shadow-2xl">

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Verify OTP
        </h2>

        <input
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-white outline-none text-center text-lg tracking-widest"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:scale-105 transition"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="text-center text-white text-sm mt-4">
          Didn’t receive OTP?{" "}
          <span
            onClick={() => navigate("/login")}
            className="underline cursor-pointer"
          >
            Try again
          </span>
        </p>

      </div>
    </div>
  );
}