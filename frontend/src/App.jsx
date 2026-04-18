import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import FloatingChat from "./components/FloatingChat";
import ChatPopup from "./components/ChatPopup";

// Public Pages
import Home from "./pages/public/Home";
import Properties from "./pages/public/Properties";
import About from "./pages/public/About.jsx";
import Chat from "./components/Chat";
import Contact from "./components/Contact";
import SelectRole from "./pages/public/SelectRole";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Otp from "./pages/Otp";
import Onboarding from "./pages/public/Onboarding";
import ForgotPassword from "./pages/ForgotPassword";

// Private Pages
import UserDashboard from "./pages/private/UserDashboard";
import AddProperty from "./pages/private/AddProperty";

// Admin Pages
import AdminLayout from "./pages/admin/AdminDashboard";
import Overview from "./pages/admin/Overview";
import PendingProperties from "./pages/admin/PendingProperties";
import ApprovedProperties from "./pages/admin/ApprovedProperties";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleChatClick = () => setIsChatOpen(true);
  const handleCloseChat = () => setIsChatOpen(false);

  return (
    <>
      <Navbar />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/about" element={<About />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/select-role" element={<SelectRole />} />

        {/* AUTH */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <Signup /> : <Navigate to="/" />}
        />
        <Route path="/otp" element={<Otp />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* ✅ FIXED: Forgot Password inside Routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* USER DASHBOARD */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute allowedRoles={["seller"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent"
          element={
            <ProtectedRoute allowedRoles={["agent"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/builder"
          element={
            <ProtectedRoute allowedRoles={["builder"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADD PROPERTY */}
        <Route
          path="/add-property"
          element={
            <ProtectedRoute allowedRoles={["seller", "agent", "builder"]}>
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
          <Route path="properties/pending" element={<PendingProperties />} />
          <Route path="properties/approved" element={<ApprovedProperties />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />

      <FloatingChat onClick={handleChatClick} />
      <ChatPopup isOpen={isChatOpen} onClose={handleCloseChat} />
    </>
  );
}

export default App;