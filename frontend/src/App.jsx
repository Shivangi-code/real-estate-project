import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/public/Home";
import Properties from "./pages/public/Properties";
import Login from "./pages/Login";
import Signup from "./pages/Signup";     // ✅ NEW
import Otp from "./pages/Otp";           // ✅ NEW
import Onboarding from "./pages/public/Onboarding";
import SelectRole from "./pages/public/SelectRole";

import AddProperty from "./pages/private/AddProperty";
import UserDashboard from "./pages/private/UserDashboard";

import AdminLayout from "./layouts/AdminLayout";
import Overview from "./pages/admin/Overview";
import PendingProperties from "./pages/admin/PendingProperties";
import ApprovedProperties from "./pages/admin/ApprovedProperties";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  // ✅ Check login
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Routes>

      {/* -------- Home Page -------- */}
      <Route path="/" element={<Home />} />

      {/* -------- Public Routes -------- */}
      <Route path="/properties" element={<Properties />} />

      {/* Role selection */}
      <Route path="/select-role" element={<SelectRole />} />

      {/* -------- Auth Routes -------- */}

      {/* Login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" /> : <Login />
        }
      />

      {/* Signup */}
      <Route
        path="/signup"
        element={
          isAuthenticated ? <Navigate to="/" /> : <Signup />
        }
      />

      {/* OTP */}
      <Route path="/otp" element={<Otp />} />

      {/* Onboarding */}
      <Route path="/onboarding" element={<Onboarding />} />

      {/* -------- Seller Dashboard -------- */}
      <Route
        path="/seller"
        element={
          <ProtectedRoute allowedRoles={["seller"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* -------- Agent Dashboard -------- */}
      <Route
        path="/agent"
        element={
          <ProtectedRoute allowedRoles={["agent"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* -------- Builder Dashboard -------- */}
      <Route
        path="/builder"
        element={
          <ProtectedRoute allowedRoles={["builder"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* -------- Add Property -------- */}
      <Route
        path="/add-property"
        element={
          <ProtectedRoute allowedRoles={["seller", "agent", "builder"]}>
            <AddProperty />
          </ProtectedRoute>
        }
      />

      {/* -------- Admin Routes -------- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        <Route path="properties/pending" element={<PendingProperties />} />
        <Route path="properties/approved" element={<ApprovedProperties />} />
      </Route>

      {/* -------- Fallback -------- */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;