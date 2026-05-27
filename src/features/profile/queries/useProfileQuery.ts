import { useQuery } from "@tanstack/react-query";
import { useUserAuth } from "../../../context/auth/useUserAuth";
import { getProfile } from "../api/getProfile";
import { profileKeys } from "./profileKeys";

export function useProfileQuery() {
  const { isAuthenticated, isLoading: isAuthLoading } = useUserAuth();

  return useQuery({
    queryKey: profileKeys.detail(),
    queryFn: getProfile,
    enabled: !isAuthLoading && isAuthenticated,
  });
}
