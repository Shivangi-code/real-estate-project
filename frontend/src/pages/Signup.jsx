import { useState } from "react";
import API from "../utils/api"; // ✅ use API instance
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      // ✅ Validation
      if (!data.name || !data.email || !data.password) {
        return alert("All fields are required");
      }

      setLoading(true);

      // ✅ Use API (baseURL handled automatically)
      await API.post("/auth/signup", data);

      alert("Signup successful");

      // ✅ Redirect to login
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
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

        <input
          className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white placeholder-white outline-none"
          placeholder="Full Name"
          value={data.name}
          onChange={(e) =>
            setData({ ...data, name: e.target.value })
          }
        />

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