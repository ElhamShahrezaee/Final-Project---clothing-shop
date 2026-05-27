export function formatCount(value: number, isFa: boolean): string {
  if (isFa) return new Intl.NumberFormat("fa-IR").format(value);
  return String(value);
}
