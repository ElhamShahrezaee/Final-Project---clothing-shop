export function getUserDisplayName(
  name: string | undefined,
  fallback: string,
  maxLength = 10,
): string {
  const trimmed = name?.trim();
  if (!trimmed) return fallback;
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength);
}
