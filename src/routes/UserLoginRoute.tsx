import { Navigate, useSearchParams } from "react-router-dom";
import Spinner from "../components/common/Spinner/Spinner";
import { useUserAuth } from "../context/auth/useUserAuth";
import { getSafeReturnUrl } from "../lib/auth/returnUrl";
import UserLogin from "../pages/Login/UserLogin";

export default function UserLoginRoute() {
  const { isLoading, isAuthenticated } = useUserAuth();
  const [searchParams] = useSearchParams();
  const returnUrl = getSafeReturnUrl(searchParams.get("returnUrl"));

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={returnUrl} replace />;
  }

  return <UserLogin />;
}
