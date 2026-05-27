import { useMutation } from "@tanstack/react-query";
import { updateProfilePassword } from "../api/updateProfilePassword";
import type { UpdatePasswordPayload } from "../types";

export function useUpdateProfilePasswordMutation() {
  return useMutation({
    mutationFn: (payload: UpdatePasswordPayload) => updateProfilePassword(payload),
  });
}
