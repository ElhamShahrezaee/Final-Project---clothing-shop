import { useProfileQuery } from "../../profile/queries/useProfileQuery";
import {
  getSelectedShippingAddress,
  isCheckoutShippingReady,
} from "../../../lib/checkout/shippingAddressStorage";

export function useCheckoutShippingReady() {
  const { data: profile, isPending } = useProfileQuery();
  const shippingAddress = getSelectedShippingAddress(profile);

  return {
    shippingAddress,
    isReady: isCheckoutShippingReady(profile),
    isPending,
  };
}
