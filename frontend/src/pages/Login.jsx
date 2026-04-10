import { useState } from "react";
import API from "../utils/api"; // ✅ use API instance
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isOtp, setIsOtp] = useState(true);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    mobile: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      // ✅ Validation
      if (isOtp && !data.mobile) {
        return alert("Enter mobile number");
      }

      if (!isOtp && (!data.email || !data.password)) {
        return alert("Enter email and password");
      }

      setLoading(true);

      if (isOtp) {
        // ✅ OTP FLOW (use API)
        await API.post("/user-auth/send-otp", {
          mobile: data.mobile,
        });

        localStorage.setItem("mobile", data.mobile);
        navigate("/otp");
      } else {
        // ✅ EMAIL LOGIN (use API)
        const res = await API.post("/auth/login", {
          email: data.email,
          password: data.password,
        });

        // ✅ FIXED: store correct tokens
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        const role = res.data.user.role;

        // ✅ Role-based redirect
        if (role === "admin") navigate("/admin");
        else if (role === "seller") navigate("/seller");
        else if (role === "agent") navigate("/agent");
        else if (role === "builder") navigate("/builder");
        else navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-600">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl w-96 shadow-2xl">

        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back
        </h2>

        {/* Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => {
              setIsOtp(true);
              setData({ mobile: "", email: "", password: "" });
            }}
            className={`px-4 py-2 rounded-full ${
              isOtp ? "bg-white text-black" : "text-white border"
            }`}
          >
            OTP
          </button>

          <button
            onClick={() => {
              setIsOtp(false);
              setData({ mobile: "", email: "", password: "" });
            }}
            className={`px-4 py-2 rounded-full ${
              !isOtp ? "bg-white text-black" : "text-white border"
            }`}
          >
            Email
          </button>
        </div>

        {/* Inputs */}
        {isOtp ? (
          <input
            className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-white outline-none"
            placeholder="Enter mobile number"
            value={data.mobile}
            onChange={(e) =>
              setData({ ...data, mobile: e.target.value })
            }
          />
        ) : (
          <>
            <input
              className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white placeholder-white outline-none"
              placeholder="Email"
              value={data.email}
              onChange={(e) =>
                setData({ ...data, email: e.target.value })
              }
            />
            <input
              type="password"
              className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-white outline-none"
              placeholder="Password"
              value={data.password}
              onChange={(e) =>
                setData({ ...data, password: e.target.value })
              }
            />
          </>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:scale-105 transition"
        >
          {loading ? "Please wait..." : "Continue"}
        </button>

        <p className="text-center text-white text-sm mt-4">
          No account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="underline cursor-pointer"
          >
            Sign up
          </span>
        </p>

      </div>
    </div>
  );
}