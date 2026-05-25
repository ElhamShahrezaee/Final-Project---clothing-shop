import { Navigate, useSearchParams } from "react-router-dom";
import Spinner from "../components/common/Spinner/Spinner";
import { useUserAuth } from "../context/auth/useUserAuth";
import { getSafeReturnUrl } from "../lib/auth/returnUrl";
import Register from "../pages/Register/Register";

export default function RegisterRoute() {
  const { isLoading, isAuthenticated, user } = useUserAuth();
  const [searchParams] = useSearchParams();
  const returnUrl = getSafeReturnUrl(searchParams.get("returnUrl"));

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isAuthenticated && user?.role === "user") {
    return <Navigate to={returnUrl} replace />;
  }

  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Register />;
}
