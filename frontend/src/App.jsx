import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Public Pages
import Home from "./pages/public/Home";
import Properties from "./pages/public/Properties";
import SelectRole from "./pages/public/SelectRole";
import Login from "./pages/public/Login";
import Onboarding from "./pages/public/Onboarding";

// Private Pages
import UserDashboard from "./pages/private/UserDashboard.jsx";
import AddProperty from "./pages/private/AddProperty.jsx";

// Admin Pages
import AdminLayout from "./pages/admin/AdminDashboard.jsx";
import Overview from "./pages/admin/Overview";
import PendingProperties from "./pages/admin/PendingProperties";
import ApprovedProperties from "./pages/admin/ApprovedProperties";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["seller", "agent", "builder"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Add Property */}
        <Route
          path="/add-property"
          element={
            <ProtectedRoute allowedRoles={["seller", "agent", "builder"]}>
              <AddProperty />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
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
      </Routes>

      <Footer />
    </>
  );
}

export default App;