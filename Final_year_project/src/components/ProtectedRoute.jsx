import { Navigate, useLocation } from "react-router";

export default function ProtectedRoute({ children, allowedRole }) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
