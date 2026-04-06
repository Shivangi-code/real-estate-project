import { useState } from "react";
import FloatingChat from "./components/FloatingChat";
import ChatPopup from "./components/ChatPopup";
 
import Chat from "./components/Chat";
import Contact from "./components/Contact";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/public/Home";
import Properties from "./pages/public/Properties";
import Login from "./pages/public/Login";
import Onboarding from "./pages/public/Onboarding";
import SelectRole from "./pages/public/SelectRole";
import About from "./pages/public/About";

import AddProperty from "./pages/private/AddProperty";
import UserDashboard from "./pages/private/UserDashboard";

import AdminLayout from "./layouts/AdminLayout";
import Overview from "./pages/admin/Overview";
import PendingProperties from "./pages/admin/PendingProperties";
import ApprovedProperties from "./pages/admin/ApprovedProperties";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {


  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatClick = () => {
  setIsChatOpen(true);
   };

   const handleCloseChat = () => {
   setIsChatOpen(false);
  }; 

 
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
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />

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
      </Routes>

      {/* ✅ 🔥 Floating Chat Button (IMPORTANT) */}
      <FloatingChat onClick={handleChatClick} />
      <ChatPopup isOpen={isChatOpen} onClose={handleCloseChat} />
    </>
  );
}

export default App;