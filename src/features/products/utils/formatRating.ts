export function formatRating(value: number, isFa: boolean): string {
  if (isFa) {
    return new Intl.NumberFormat("fa-IR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  }
  return value.toFixed(1);
}
