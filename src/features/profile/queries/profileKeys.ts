export const profileKeys = {
  root: ["profile"] as const,
  detail: () => [...profileKeys.root, "detail"] as const,
};
