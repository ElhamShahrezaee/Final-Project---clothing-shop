const DEFAULT_RETURN = "/";

export function getSafeReturnUrl(raw: string | null | undefined, fallback = DEFAULT_RETURN): string {
  if (!raw?.trim()) return fallback;

  try {
    const decoded = decodeURIComponent(raw.trim());
    if (decoded.startsWith("/") && !decoded.startsWith("//")) {
      return decoded;
    }
  } catch {
    // ignore malformed encoding
  }

  return fallback;
}

export function buildLoginPath(returnPath: string): string {
  const safe = getSafeReturnUrl(returnPath);
  return `/login?returnUrl=${encodeURIComponent(safe)}`;
}

export function buildRegisterPath(returnPath: string): string {
  const safe = getSafeReturnUrl(returnPath);
  return `/register?returnUrl=${encodeURIComponent(safe)}`;
}
