import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../common/Spinner/Spinner";
import { PROFILE_ADDRESS_ID } from "../../features/checkout/types";
import { useProfileQuery } from "../../features/profile/queries/useProfileQuery";
import { useAppLocale } from "../../hooks/useAppLocale";
import {
  addLocalShippingAddress,
  getCheckoutAddressOptions,
  getSelectedAddressId,
  setSelectedAddressId,
} from "../../lib/checkout/shippingAddressStorage";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

const sectionClass = "rounded-xl border border-gray-200 bg-white p-5 sm:p-6";

const actionBtnClass =
  "inline-flex h-10 items-center justify-center rounded-full border border-gray-900 px-5 text-sm font-medium transition hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60";

const secondaryBtnClass =
  "inline-flex h-10 items-center justify-center rounded-full border border-gray-300 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60";

type ShippingAddressSelectorProps = {
  onSelectionChange?: () => void;
};

export default function ShippingAddressSelector({
  onSelectionChange,
}: ShippingAddressSelectorProps) {
  const { t } = useTranslation();
  const { isFa, dir, textAlign } = useAppLocale();
  const { data: profile, isPending, isError, refetch } = useProfileQuery();

  const [selectedId, setSelectedId] = useState<string | null>(() => getSelectedAddressId());
  const [showNewForm, setShowNewForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [localVersion, setLocalVersion] = useState(0);

  const inputDir = isFa ? "rtl" : "ltr";

  const { profileOption, localAddresses } = profile
    ? getCheckoutAddressOptions(profile)
    : { profileOption: null, localAddresses: [] };

  useEffect(() => {
    if (isPending || !profile) return;
    const current = getSelectedAddressId();
    if (current) {
      setSelectedId(current);
      return;
    }
    const { profileOption: po, localAddresses: local } = getCheckoutAddressOptions(profile);
    if (po) {
      setSelectedAddressId(PROFILE_ADDRESS_ID);
      setSelectedId(PROFILE_ADDRESS_ID);
      onSelectionChange?.();
      return;
    }
    if (local.length > 0) {
      setSelectedAddressId(local[0].id);
      setSelectedId(local[0].id);
      onSelectionChange?.();
    }
  }, [isPending, profile, localVersion, onSelectionChange]);

  const handleSelect = (id: string) => {
    setSelectedAddressId(id);
    setSelectedId(id);
    setShowNewForm(false);
    onSelectionChange?.();
  };

  const validateNewForm = (): string | null => {
    if (!name.trim()) return t("cart.checkout.recipientRequired");
    if (!phone.trim()) return t("cart.checkout.phoneRequired");
    if (!address.trim()) return t("address.validation.required");
    return null;
  };

  const handleSaveNew = () => {
    setFormError(null);
    const err = validateNewForm();
    if (err) {
      setFormError(err);
      return;
    }
    const saved = addLocalShippingAddress({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });
    setLocalVersion((v) => v + 1);
    setShowNewForm(false);
    setName("");
    setPhone("");
    setAddress("");
    handleSelect(saved.id);
  };

  if (isPending) {
    return (
      <div className="flex min-h-[12rem] items-center justify-center rounded-xl border border-gray-200 bg-white">
        <Spinner size="md" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div dir={dir} className={`rounded-xl border border-gray-200 bg-white p-6 ${textAlign}`}>
        <p className="text-sm text-red-600" role="alert">
          {t("address.error.load")}
        </p>
        <button type="button" onClick={() => void refetch()} className={`mt-4 ${actionBtnClass}`}>
          {t("address.retry")}
        </button>
      </div>
    );
  }

  const hasOptions = Boolean(profileOption) || localAddresses.length > 0;

  return (
    <section className={sectionClass}>
      <h2 className="text-lg font-semibold text-gray-900">{t("cart.checkout.addressTitle")}</h2>

      <div className="mt-4 space-y-3">
        {profileOption ? (
          <label
            className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition ${
              selectedId === PROFILE_ADDRESS_ID
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <input
              type="radio"
              name="shipping-address"
              className="mt-1 shrink-0"
              checked={selectedId === PROFILE_ADDRESS_ID}
              onChange={() => handleSelect(PROFILE_ADDRESS_ID)}
            />
            <span className="min-w-0 flex-1 text-sm text-gray-800">
              <span className="block font-medium text-gray-900">{profileOption.name}</span>
              <span className="mt-1 block text-gray-600">{profileOption.phone}</span>
              <span className="mt-1 block whitespace-pre-wrap">{profileOption.address}</span>
              <span className="mt-1 block text-xs text-gray-500">
                {t("cart.checkout.profileAddressLabel")}
              </span>
            </span>
          </label>
        ) : null}

        {localAddresses.map((item) => (
          <label
            key={item.id}
            className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition ${
              selectedId === item.id
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <input
              type="radio"
              name="shipping-address"
              className="mt-1 shrink-0"
              checked={selectedId === item.id}
              onChange={() => handleSelect(item.id)}
            />
            <span className="min-w-0 flex-1 text-sm text-gray-800">
              <span className="block font-medium text-gray-900">{item.name}</span>
              <span className="mt-1 block text-gray-600">{item.phone}</span>
              <span className="mt-1 block whitespace-pre-wrap">{item.address}</span>
            </span>
          </label>
        ))}

        {!hasOptions && !showNewForm ? (
          <p className="text-sm text-gray-600">{t("cart.checkout.noAddress")}</p>
        ) : null}
      </div>

      {!showNewForm ? (
        <button type="button" onClick={() => setShowNewForm(true)} className={`mt-4 ${actionBtnClass}`}>
          {t("cart.checkout.addNewAddress")}
        </button>
      ) : (
        <div className="mt-4 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-900">{t("cart.checkout.newAddressTitle")}</h3>
          <div>
            <label htmlFor="new-recipient" className="mb-1.5 block text-sm font-medium text-gray-700">
              {t("cart.checkout.recipientName")}
            </label>
            <input
              id="new-recipient"
              type="text"
              dir={inputDir}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="new-phone" className="mb-1.5 block text-sm font-medium text-gray-700">
              {t("cart.checkout.phone")}
            </label>
            <input
              id="new-phone"
              type="tel"
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="new-address" className="mb-1.5 block text-sm font-medium text-gray-700">
              {t("address.label")}
            </label>
            <textarea
              id="new-address"
              rows={3}
              dir={inputDir}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`${inputClass} resize-y`}
            />
          </div>
          {formError ? (
            <p className="text-sm text-red-600" role="alert">
              {formError}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleSaveNew} className={actionBtnClass}>
              {t("cart.checkout.saveAddress")}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNewForm(false);
                setFormError(null);
              }}
              className={secondaryBtnClass}
            >
              {t("cart.checkout.cancel")}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
