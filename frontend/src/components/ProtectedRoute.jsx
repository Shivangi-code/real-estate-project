import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  allowedRoles,
}) {

  const {
    user,
    isAuthenticated,
  } = useAuth();

  // ❌ NOT LOGGED IN
  if (!isAuthenticated || !user) {

    // ✅ REDIRECT TO HOME
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // ❌ ROLE NOT ALLOWED
  if (
    allowedRoles &&
    !allowedRoles.includes(
      user.role
    )
  ) {

    // ✅ REDIRECT TO HOME
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // ✅ ACCESS GRANTED
  return children;
}