export function formatStorePrice(price: number, isFa: boolean): string {
  if (isFa) {
    return `${new Intl.NumberFormat("fa-IR").format(price)} تومان`;
  }
  return `$${new Intl.NumberFormat("en-US").format(price)}`;
}
