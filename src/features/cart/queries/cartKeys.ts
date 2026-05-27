export type CartScope = "guest" | "user";

export const cartKeys = {
  root: ["cart"] as const,
  scope: (scope: CartScope) => [...cartKeys.root, scope] as const,
};

export function getCartScope(isAuthenticated: boolean): CartScope {
  return isAuthenticated ? "user" : "guest";
}
