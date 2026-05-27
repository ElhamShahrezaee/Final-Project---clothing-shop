import { Navigate, Outlet, useLocation } from "react-router-dom";
import Spinner from "../components/common/Spinner/Spinner";
import { useUserAuth } from "../context/auth/useUserAuth";
import { buildLoginPath } from "../lib/auth/returnUrl";

export default function UserProtectedRoute() {
  const { isLoading, isAuthenticated } = useUserAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={buildLoginPath(location.pathname)} replace />;
  }

  return <Outlet />;
}
