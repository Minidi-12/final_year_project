import { Navigate, useLocation } from "react-router";

export default function ProtectedRoute({ children, allowedRole }) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // Redirect to login if no token exists
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to login if user role doesn't match (instead of unauthorized page)
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
