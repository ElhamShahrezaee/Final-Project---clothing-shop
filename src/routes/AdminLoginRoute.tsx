import { Navigate } from "react-router-dom";
import Spinner from "../components/common/Spinner/Spinner";
import { useAuth } from "../context/auth/useAuth";
import AdminLogin from "../pages/Admin/Login/AdminLogin";

export default function AdminLoginRoute() {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <AdminLogin />;
}
