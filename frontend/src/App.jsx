import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import TopNavbar from "./components/TopNavbar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import FloatingChat from "./components/FloatingChat";
import ChatPopup from "./components/ChatPopup";

// PUBLIC PAGES
import Home from "./pages/public/Home";
import Properties from "./pages/public/Properties";
import PropertyDetails from "./pages/public/PropertyDetails";
import About from "./pages/public/About.jsx";
import Chat from "./components/Chat";
import Contact from "./components/Contact";
import SelectRole from "./pages/public/SelectRole";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Otp from "./pages/Otp";
import Onboarding from "./pages/public/Onboarding";
import ForgotPassword from "./pages/ForgotPassword";

// PRIVATE PAGES
import SellerDashboard from "./pages/private/SellerDashboard";
import BuilderDashboard from "./pages/private/BuilderDashboard";
import AddProperty from "./pages/private/AddProperty";

// ADMIN PAGES
import AdminLayout from "./pages/admin/AdminDashboard";
import Overview from "./pages/admin/Overview";
import PendingProperties from "./pages/admin/PendingProperties";
import ApprovedProperties from "./pages/admin/ApprovedProperties";
import RejectedProperties from "./pages/admin/RejectedProperties";
import DeletedProperties from "./pages/admin/DeletedProperties";
import VerificationBoard from "./pages/admin/VerificationBoard";
import LeadsDashboard from "./pages/admin/LeadsDashboard";

// ROLE REDIRECT
function RoleRedirect() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/" replace />;

  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "seller") return <Navigate to="/seller" replace />;
  if (user.role === "builder") return <Navigate to="/builder" replace />;

  return <Navigate to="/" replace />;
}

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* TOAST */}
      <Toaster position="top-right" />

      {/* TOP NAVBAR */}
      <TopNavbar />

      {/* MAIN NAVBAR */}
      <Navbar />

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard-redirect" element={<RoleRedirect />} />

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/properties"
          element={<Properties />}
        />

        <Route
          path="/properties/:id"
          element={<PropertyDetails />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/chat"
          element={<Chat />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/select-role"
          element={<SelectRole />}
        />

        <Route
          path="/otp"
          element={<Otp />}
        />

        <Route
          path="/onboarding"
          element={<Onboarding />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* ✅ FIXED LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* ✅ FIXED SIGNUP */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* ROLE REDIRECT */}
        <Route
          path="/dashboard-redirect"
          element={<RoleRedirect />}
        />

        {/* SELLER */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        {/* BUILDER */}
        <Route
          path="/builder"
          element={
            <ProtectedRoute allowedRoles={["builder"]}>
              <BuilderDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADD PROPERTY */}
        <Route
          path="/add-property"
          element={
            <ProtectedRoute allowedRoles={["seller", "builder", "admin"]}>
              <AddProperty />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
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
          <Route path="add-property" element={<AddProperty />} />
          <Route path="leads" element={<LeadsDashboard />} />
          <Route path="properties/pending" element={<PendingProperties />} />
          <Route path="properties/approved" element={<ApprovedProperties />} />
          <Route path="properties/rejected" element={<RejectedProperties />} />
          <Route path="properties/deleted" element={<DeletedProperties />} />
          <Route path="verification-board" element={<VerificationBoard />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* FOOTER */}
      <Footer />

      {/* CHAT */}
      <FloatingChat onClick={() => setIsChatOpen(true)} />

      <ChatPopup
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
}

export default App;