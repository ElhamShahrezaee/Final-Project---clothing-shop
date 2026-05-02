import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "../components/common/Spinner/Spinner";
import { useAuth } from "../context/auth/useAuth";

export default function AdminProtectedRoute() {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
