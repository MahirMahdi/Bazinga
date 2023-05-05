import { useLocation, Outlet, Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}
