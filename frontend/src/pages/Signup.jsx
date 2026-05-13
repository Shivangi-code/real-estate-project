import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [data, setData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "buyer",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SIGNUP =================
  const handleSignup = async () => {
    try {
      if (!data.name || !data.password) {
        return alert("Name & password required");
      }

      if (!data.email && !data.mobile) {
        return alert("Email or mobile required");
      }

      setLoading(true);

      await API.post("/user-auth/register", {
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
        role: data.role,
      });

      alert(`Signup successful as ${data.role} 🎉`);

      navigate("/login");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-600">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 p-8 rounded-2xl w-96 shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account
        </h2>

        {/* NAME */}
        <input
          name="name"
          placeholder="Full Name"
          value={data.name}
          onChange={handleChange}
          className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white placeholder-white outline-none"
        />

        {/* EMAIL */}
        <input
          name="email(optional)"
          placeholder="Email"
          value={data.email}
          onChange={handleChange}
          className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white placeholder-white outline-none"
        />

        {/* MOBILE */}
        <input
          name="mobile(required)"
          placeholder="Mobile"
          value={data.mobile}
          onChange={handleChange}
          className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white placeholder-white outline-none"
        />

        {/* PASSWORD */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
          className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white placeholder-white outline-none"
        />

        {/* ROLE */}
        <select
          name="role"
          value={data.role}
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white outline-none"
        >
          <option value="buyer" className="text-black">
            Buyer
          </option>
          <option value="seller" className="text-black">
            Seller
          </option>
          <option value="builder" className="text-black">
            Builder
          </option>
        </select>

        {/* BUTTON */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:scale-105 transition"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="text-center text-white text-sm mt-4">
          Already have an account?{" "}
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