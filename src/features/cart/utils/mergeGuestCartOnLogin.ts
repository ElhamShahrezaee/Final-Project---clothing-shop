import { addToCart } from "../api/addToCart";
import { clearGuestCart, getGuestCart } from "../guest/guestCartStorage";
import { cartKeys } from "../queries/cartKeys";
import { queryClient } from "../../../lib/react-query/queryClient";

export async function mergeGuestCartOnLogin(): Promise<void> {
  const guest = getGuestCart();
  if (guest.items.length === 0) return;

  for (const item of guest.items) {
    await addToCart(item.product.id, item.quantity);
  }

  clearGuestCart();
  await queryClient.invalidateQueries({ queryKey: cartKeys.root });
}
