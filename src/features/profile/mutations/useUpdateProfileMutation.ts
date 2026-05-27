import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/updateProfile";
import { profileKeys } from "../queries/profileKeys";
import type { UpdateProfilePayload } from "../types";

export function useUpdateProfileMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: (profile) => {
      qc.setQueryData(profileKeys.detail(), profile);
    },
  });
}
