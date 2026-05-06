export function formatPrice(price: number, isFa: boolean): string {
  const locale = isFa ? "fa-IR" : "en-US";
  return new Intl.NumberFormat(locale).format(price);
}
