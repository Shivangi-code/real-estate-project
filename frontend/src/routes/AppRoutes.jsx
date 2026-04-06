import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import AdminDashboard from "../pages/admin/AdminDashboard";
import SellerDashboard from "../pages/seller/SellerDashboard";

import Chat from "../components/Chat";
import Contact from "../components/Contact";

const AppRoutes = () => {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/chat" element={<Chat />} />
      <Route path="/contact" element={<Contact />} />

      {/* ADMIN */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* SELLER */}
      <Route element={<ProtectedRoute role="seller" />}>
        <Route path="/seller" element={<SellerDashboard />} />
      </Route>

    </Routes>
  );
};

export default AppRoutes;