import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import FloatingChat from "./components/FloatingChat";
import ChatPopup from "./components/ChatPopup";

// Public Pages
import Home from "./pages/public/Home";
import Properties from "./pages/public/Properties";
import About from "./pages/public/About";
import Chat from "./components/Chat";
import Contact from "./components/Contact";
import SelectRole from "./pages/public/SelectRole";
import Login from "./pages/public/Login";
import Signup from "./pages/Signup";
import Otp from "./pages/Otp";
import Onboarding from "./pages/public/Onboarding";

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

  const handleChatClick = () => setIsChatOpen(true);
  const handleCloseChat = () => setIsChatOpen(false);

  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <>
      {/* ✅ Navbar */}
      <Navbar />

      {/* ✅ Routes */}
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/about" element={<About />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/select-role" element={<SelectRole />} />

        {/* AUTH ROUTES */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Login />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Signup />
          }
        />
        <Route path="/otp" element={<Otp />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* USER DASHBOARD (ROLE BASED) */}
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

        {/* ADMIN ROUTES */}
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

      {/* ✅ Footer */}
      <Footer />

      {/* 🔥 Floating Chat */}
      <FloatingChat onClick={handleChatClick} />
      <ChatPopup isOpen={isChatOpen} onClose={handleCloseChat} />
    </>
  );
}

export default App;