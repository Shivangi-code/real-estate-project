import {

  useEffect,

  useState,

} from "react";

import {

  Routes,

  Route,

  Navigate,

} from "react-router-dom";

import {

  Toaster,

  toast,

} from "react-hot-toast";

// ======================================================
// ================= SOCKET =============================
// ======================================================

import socket from "./socket";

// ======================================================
// ================= LAYOUT =============================
// ======================================================

import TopNavbar from "./components/TopNavbar";

import Navbar from "./components/Navbar";

import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";

// ======================================================
// ================= CHAT ===============================
// ======================================================

import FloatingChat from "./components/FloatingChat";

import ChatPopup from "./components/ChatPopup";

// ======================================================
// ================= PUBLIC =============================
// ======================================================

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

// ======================================================
// ================= PRIVATE ============================
// ======================================================

import SellerDashboard from "./pages/private/SellerDashboard";

import BuilderDashboard from "./pages/private/BuilderDashboard";

import BuilderProperties from "./pages/private/BuilderProperties";

import MyProperties from "./pages/private/MyProperties";

import AddProperty from "./pages/private/AddProperty";

// ======================================================
// ================= ADMIN ==============================
// ======================================================

import AdminLayout from "./pages/admin/AdminDashboard";

import Overview from "./pages/admin/Overview";

import AdminProperties from "./pages/admin/AdminProperties";

import PendingProperties from "./pages/admin/PendingProperties";

import ApprovedProperties from "./pages/admin/ApprovedProperties";

import RejectedProperties from "./pages/admin/RejectedProperties";

import DeletedProperties from "./pages/admin/DeletedProperties";

import VerificationBoard from "./pages/admin/VerificationBoard";

import LeadsDashboard from "./pages/admin/LeadsDashboard";

import PropertyReview from "./pages/admin/PropertyReview";

import PropertyImagesReview from "./pages/admin/PropertyImagesReview";

// ======================================================
// ================= SAFE USER ==========================
// ======================================================

const getSafeUser =
  () => {

    try {

      return JSON.parse(

        localStorage.getItem(
          "user"
        ) || "{}"
      );

    } catch {

      return {};
    }
  };

// ======================================================
// ================= ROLE REDIRECT ======================
// ======================================================

function RoleRedirect() {

  const user =
    getSafeUser();

  // ======================================================
  // ================= NO USER ============================
  // ======================================================

  if (
    !user ||
    !user.role
  ) {

    return (

      <Navigate
        to="/"
        replace
      />
    );
  }

  // ======================================================
  // ================= ADMIN ==============================
  // ======================================================

  if (
    user.role ===
    "admin"
  ) {

    return (

      <Navigate
        to="/admin"
        replace
      />
    );
  }

  // ======================================================
  // ================= SELLER =============================
  // ======================================================

  if (
    user.role ===
    "seller"
  ) {

    return (

      <Navigate
        to="/seller-dashboard"
        replace
      />
    );
  }

  // ======================================================
  // ================= BUILDER ============================
  // ======================================================

  if (
    user.role ===
    "builder"
  ) {

    return (

      <Navigate
        to="/builder-dashboard"
        replace
      />
    );
  }

  // ======================================================
  // ================= AGENT ==============================
  // ======================================================

  if (
    user.role ===
    "agent"
  ) {

    return (

      <Navigate
        to="/seller-dashboard"
        replace
      />
    );
  }

  // ======================================================
  // ================= FALLBACK ===========================
  // ======================================================

  return (

    <Navigate
      to="/"
      replace
    />
  );
}

// ======================================================
// ================= APP ================================
// ======================================================

function App() {

  // ======================================================
  // ================= STATES =============================
  // ======================================================

  const [

    isChatOpen,

    setIsChatOpen,

  ] = useState(false);

  // ======================================================
  // ================= SOCKET LISTENERS ==================
  // ======================================================

  useEffect(() => {

    // ======================================================
    // ================= PROPERTY UPDATED ===================
    // ======================================================

    const handlePropertyUpdated =
      (
        data
      ) => {

        console.log(

          "🏠 Live Property Update:",

          data
        );
      };

    // ======================================================
    // ================= MODERATION NOTIFICATION ============
    // ======================================================

    const handleModerationNotification =
      (
        notification
      ) => {

        console.log(

          "🔔 Moderation Notification:",

          notification
        );

        // ======================================================
        // ================= TOAST TYPE =========================
        // ======================================================

        const icon =
          notification?.icon ||
          "🔔";

        const title =
          notification?.title ||

          "Moderation Update";

        const message =
          notification?.message ||

          "";

        // ======================================================
        // ================= SUCCESS ============================
        // ======================================================

        if (
          notification?.status ===
          "approved"
        ) {

          toast.success(

            `${icon} ${title}`,

            {

              duration: 5000,
            }
          );
        }

        // ======================================================
        // ================= REJECTED ===========================
        // ======================================================

        else if (
          notification?.status ===
          "rejected"
        ) {

          toast.error(

            `${icon} ${title}`,

            {

              duration: 7000,
            }
          );
        }

        // ======================================================
        // ================= PENDING ============================
        // ======================================================

        else if (
          notification?.status ===
          "pending"
        ) {

          toast(

            `${icon} ${title}`,

            {

              duration: 5000,
            }
          );
        }

        // ======================================================
        // ================= DELETED ============================
        // ======================================================

        else if (
          notification?.status ===
          "deleted"
        ) {

          toast(

            `${icon} ${title}`,

            {

              duration: 5000,
            }
          );
        }

        // ======================================================
        // ================= FALLBACK ===========================
        // ======================================================

        else {

          toast(

            `${icon} ${title}`,

            {

              duration: 5000,
            }
          );
        }

        // ======================================================
        // ================= MESSAGE TOAST ======================
        // ======================================================

        if (
          message
        ) {

          setTimeout(() => {

            toast(

              message,

              {

                duration: 6000,
              }
            );

          }, 600);
        }
      };

    // ======================================================
    // ================= MODERATION ACTIVITY ================
    // ======================================================

    const handleModerationActivity =
      (
        activity
      ) => {

        console.log(

          "📋 Moderation Activity:",

          activity
        );
      };

    // ======================================================
    // ================= SOCKET EVENTS ======================
    // ======================================================

    socket.on(

      "propertyUpdated",

      handlePropertyUpdated
    );

    socket.on(

      "moderationNotification",

      handleModerationNotification
    );

    socket.on(

      "moderationActivity",

      handleModerationActivity
    );

    // ======================================================
    // ================= CLEANUP ============================
    // ======================================================

    return () => {

      socket.off(

        "propertyUpdated",

        handlePropertyUpdated
      );

      socket.off(

        "moderationNotification",

        handleModerationNotification
      );

      socket.off(

        "moderationActivity",

        handleModerationActivity
      );
    };

  }, []);

  // ======================================================
  // ================= RETURN =============================
  // ======================================================

  return (

    <>

      {/* ====================================================== */}
      {/* ================= TOASTER ============================ */}
      {/* ====================================================== */}

      <Toaster

        position="top-right"

        reverseOrder={false}

        toastOptions={{

          duration: 5000,

          style: {

            borderRadius:
              "18px",

            background:
              "#111827",

            color:
              "#ffffff",

            padding:
              "16px",

            fontWeight:
              "600",

            boxShadow:
              "0 10px 40px rgba(0,0,0,0.18)",
          },

          success: {

            style: {

              background:
                "#065f46",
            },
          },

          error: {

            style: {

              background:
                "#991b1b",
            },
          },
        }}
      />

      {/* ====================================================== */}
      {/* ================= TOP NAVBAR ========================= */}
      {/* ====================================================== */}

      <TopNavbar />

      {/* ====================================================== */}
      {/* ================= MAIN NAVBAR ======================== */}
      {/* ====================================================== */}

      <Navbar />

      {/* ====================================================== */}
      {/* ================= ROUTES ============================= */}
      {/* ====================================================== */}

      <Routes>

        {/* ====================================================== */}
        {/* ================= PUBLIC ============================= */}
        {/* ====================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/properties"
          element={<Properties />}
        />

        <Route
          path="/property/:id"
          element={
            <PropertyDetails />
          }
        />

        <Route
          path="/properties/:id"
          element={
            <PropertyDetails />
          }
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
          element={
            <Onboarding />
          }
        />

        <Route
          path="/forgot-password"
          element={
            <ForgotPassword />
          }
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* ====================================================== */}
        {/* ================= ROLE REDIRECT ====================== */}
        {/* ====================================================== */}

        <Route
          path="/dashboard-redirect"
          element={
            <RoleRedirect />
          }
        />

        {/* ====================================================== */}
        {/* ================= SELLER ============================= */}
        {/* ====================================================== */}

        <Route
          path="/seller-dashboard"
          element={

            <ProtectedRoute
              allowedRoles={[
                "seller",
                "agent",
              ]}
            >

              <SellerDashboard />

            </ProtectedRoute>
          }
        />

        {/* ====================================================== */}
        {/* ================= BUILDER ============================ */}
        {/* ====================================================== */}

        <Route
          path="/builder-dashboard"
          element={

            <ProtectedRoute
              allowedRoles={[
                "builder",
              ]}
            >

              <BuilderDashboard />

            </ProtectedRoute>
          }
        />
        {/* ====================================================== */}
        {/* ================= BUILDER PROPERTIES ================= */}
        {/* ====================================================== */}

        <Route
          path="/builder-properties"
          element={
            <ProtectedRoute
              allowedRoles={[
                "builder",
              ]}
            >
              <BuilderProperties />
            </ProtectedRoute>
          }
        />

        {/* ====================================================== */}
        {/* ================= ADMIN PROPERTIES =================== */}
        {/* ====================================================== */}

        <Route
          path="admin-properties"
          element={
            <ProtectedRoute
              allowedRoles={[
                "admin",
              ]}
            >
              <AdminProperties />
            </ProtectedRoute>
          }
        />
        
        {/* ====================================================== */}
        {/* ================= MY PROPERTIES ====================== */}
        {/* ====================================================== */}

        <Route
          path="/my-properties"
          element={

            <ProtectedRoute
              allowedRoles={[

                "seller",

                "agent",

                "admin",
              ]}
            >

              <MyProperties />

            </ProtectedRoute>
          }
        />

        {/* ====================================================== */}
        {/* ================= ADD PROPERTY ======================= */}
        {/* ====================================================== */}

        <Route
          path="/add-property"
          element={

            <ProtectedRoute
              allowedRoles={[

                "seller",

                "builder",

                "agent",

                "admin",
              ]}
            >

              <AddProperty />

            </ProtectedRoute>
          }
        />

        {/* ====================================================== */}
        {/* ================= ADMIN ============================== */}
        {/* ====================================================== */}

        <Route
          path="/admin"
          element={

            <ProtectedRoute
              allowedRoles={[
                "admin",
              ]}
            >

              <AdminLayout />

            </ProtectedRoute>
          }
        >

          {/* ====================================================== */}
          {/* ================= OVERVIEW =========================== */}
          {/* ====================================================== */}

          <Route
            index
            element={<Overview />}
          />

          <Route
            path="overview"
            element={<Overview />}
          />

          {/* ====================================================== */}
          {/* ================= PROPERTY =========================== */}
          {/* ====================================================== */}

          <Route
            path="add-property"
            element={
              <AddProperty />
            }
          />

          {/* ====================================================== */}
          {/* ================= LEADS ============================== */}
          {/* ====================================================== */}

          <Route
            path="leads"
            element={
              <LeadsDashboard />
            }
          />

          {/* ====================================================== */}
          {/* ================= VERIFICATION ======================= */}
          {/* ====================================================== */}

          <Route
            path="properties/pending"
            element={
              <PendingProperties />
            }
          />

          <Route
            path="properties/approved"
            element={
              <ApprovedProperties />
            }
          />

          <Route
            path="properties/rejected"
            element={
              <RejectedProperties />
            }
          />

          <Route
            path="properties/deleted"
            element={
              <DeletedProperties />
            }
          />

          <Route
            path="verification-board"
            element={
              <VerificationBoard />
            }
          />

          <Route
            path="property/:id"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <PropertyReview />
              </ProtectedRoute>
            }
          />

          <Route
            path="property/:id/images"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <PropertyImagesReview />
              </ProtectedRoute>
            }
          />

        </Route>

        {/* ====================================================== */}
        {/* ================= FALLBACK =========================== */}
        {/* ====================================================== */}

        <Route

          path="*"

          element={

            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

      {/* ====================================================== */}
      {/* ================= FOOTER ============================= */}
      {/* ====================================================== */}

      <Footer />

      {/* ====================================================== */}
      {/* ================= FLOATING CHAT ====================== */}
      {/* ====================================================== */}

      <FloatingChat

        onClick={() =>
          setIsChatOpen(
            true
          )
        }
      />

      {/* ====================================================== */}
      {/* ================= CHAT POPUP ========================= */}
      {/* ====================================================== */}

      {isChatOpen && (

        <ChatPopup

          isOpen={
            isChatOpen
          }

          onClose={() =>
            setIsChatOpen(
              false
            )
          }
        />
      )}

    </>
  );
}

export default App;