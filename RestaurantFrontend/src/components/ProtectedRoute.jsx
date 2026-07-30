import { Navigate } from "react-router-dom";

import {
  getToken,
  getRole,
} from "../utils/auth";

export default function ProtectedRoute({
  children,
  role,
}) {

  const token = getToken();

  if (!token) {

    return <Navigate to="/" replace />;

  }

  const userRole = getRole();

  if (role && userRole !== role) {

    if (userRole === "Admin") {

      return <Navigate to="/admin/dashboard" replace />;

    }

    if (userRole === "Customer") {

      return <Navigate to="/customer/home" replace />;

    }

    return <Navigate to="/" replace />;

  }

  return children;

}