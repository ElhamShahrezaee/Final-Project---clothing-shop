export type ShippingAddress = {
  name: string;
  phone: string;
  address: string;
};

export type StoredShippingAddress = ShippingAddress & {
  id: string;
};

export type PaymentMethod = "cash" | "credit" | "card";

export const PROFILE_ADDRESS_ID = "profile";
