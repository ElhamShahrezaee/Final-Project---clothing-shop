import {
  PROFILE_ADDRESS_ID,
  type ShippingAddress,
  type StoredShippingAddress,
} from "../../features/checkout/types";
import type { UserProfile } from "../../features/profile/types";

const ADDRESSES_KEY = "checkout_shipping_addresses";
const SELECTED_ID_KEY = "checkout_selected_address_id";

function readAddresses(): StoredShippingAddress[] {
  try {
    const raw = localStorage.getItem(ADDRESSES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is StoredShippingAddress =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as StoredShippingAddress).id === "string" &&
        typeof (item as StoredShippingAddress).name === "string" &&
        typeof (item as StoredShippingAddress).phone === "string" &&
        typeof (item as StoredShippingAddress).address === "string",
    );
  } catch {
    return [];
  }
}

function writeAddresses(addresses: StoredShippingAddress[]) {
  localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
}

export function getLocalShippingAddresses(): StoredShippingAddress[] {
  return readAddresses();
}

export function addLocalShippingAddress(
  address: Omit<StoredShippingAddress, "id">,
): StoredShippingAddress {
  const entry: StoredShippingAddress = {
    id: `addr-${Date.now()}`,
    ...address,
  };
  const next = [...readAddresses(), entry];
  writeAddresses(next);
  return entry;
}

export function getSelectedAddressId(): string | null {
  return localStorage.getItem(SELECTED_ID_KEY);
}

export function setSelectedAddressId(id: string) {
  localStorage.setItem(SELECTED_ID_KEY, id);
}

export function profileToShippingOption(profile: UserProfile): ShippingAddress | null {
  const address = profile.address?.trim();
  if (!address) return null;
  return {
    name: profile.name.trim(),
    phone: profile.phone?.trim() ?? "",
    address,
  };
}

export function getSelectedShippingAddress(
  profile?: UserProfile | null,
): ShippingAddress | null {
  const selectedId = getSelectedAddressId();
  if (!selectedId) return null;

  if (selectedId === PROFILE_ADDRESS_ID) {
    return profile ? profileToShippingOption(profile) : null;
  }

  const local = readAddresses().find((a) => a.id === selectedId);
  if (!local) return null;
  return {
    name: local.name,
    phone: local.phone,
    address: local.address,
  };
}

export function isShippingAddressComplete(address: ShippingAddress | null): boolean {
  if (!address) return false;
  return Boolean(
    address.name.trim() && address.phone.trim() && address.address.trim(),
  );
}

export function isCheckoutShippingReady(profile?: UserProfile | null): boolean {
  return isShippingAddressComplete(getSelectedShippingAddress(profile));
}

export function getCheckoutAddressOptions(profile?: UserProfile | null) {
  const profileOption = profile ? profileToShippingOption(profile) : null;
  const local = getLocalShippingAddresses();
  return { profileOption, localAddresses: local };
}
