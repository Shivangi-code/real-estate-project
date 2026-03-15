import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import AdminDashboard from "../pages/admin/AdminDashboard";
import SellerDashboard from "../pages/seller/SellerDashboard";

const AppRoutes = () => {
  return (
    <Routes>

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