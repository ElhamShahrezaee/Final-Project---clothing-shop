import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../common/Spinner/Spinner";
import { useUpdateProfileMutation } from "../../features/profile/mutations/useUpdateProfileMutation";
import { useProfileQuery } from "../../features/profile/queries/useProfileQuery";
import { useAppLocale } from "../../hooks/useAppLocale";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

const sectionClass = "rounded-xl border border-gray-200 bg-white p-5 sm:p-6";

const actionBtnClass =
  "inline-flex h-10 items-center justify-center rounded-full border border-gray-900 px-5 text-sm font-medium transition hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60";

const secondaryBtnClass =
  "inline-flex h-10 items-center justify-center rounded-full border border-gray-300 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60";

type AddressSectionProps = {
  readOnly?: boolean;
  titleKey?: string;
  hideTitle?: boolean;
  onAddressSaved?: (address: string) => void;
};

export default function AddressSection({
  readOnly = false,
  titleKey = "cart.checkout.shippingAddress",
  hideTitle = false,
  onAddressSaved,
}: AddressSectionProps) {
  const { t } = useTranslation();
  const { isFa, dir, textAlign } = useAppLocale();
  const { data: profile, isPending, isError, refetch } = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [draftAddress, setDraftAddress] = useState("");
  const [addressError, setAddressError] = useState<string | null>(null);

  const inputDir = isFa ? "rtl" : "ltr";
  const displayAddress = profile?.address?.trim() ?? "";

  useEffect(() => {
    if (!profile) return;
    setDraftAddress(profile.address ?? "");
  }, [profile]);

  const validateAddress = (value: string): string | null => {
    if (!value.trim()) return t("address.validation.required");
    return null;
  };

  const handleStartEdit = () => {
    setDraftAddress(displayAddress);
    setAddressError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setDraftAddress(displayAddress);
    setAddressError(null);
    setIsEditing(false);
  };

  const handleConfirmEdit = async () => {
    setAddressError(null);
    const validationError = validateAddress(draftAddress);
    if (validationError) {
      setAddressError(validationError);
      return;
    }

    const trimmed = draftAddress.trim();
    try {
      await updateProfileMutation.mutateAsync({ address: trimmed });
      setIsEditing(false);
      onAddressSaved?.(trimmed);
    } catch (err) {
      setAddressError(err instanceof Error ? err.message : t("address.error.update"));
    }
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

  return (
    <section className={sectionClass} aria-labelledby="address-section-heading">
      {hideTitle ? (
        <h2 id="address-section-heading" className="sr-only">
          {t(titleKey)}
        </h2>
      ) : (
        <h2 id="address-section-heading" className="text-lg font-semibold text-gray-900">
          {t(titleKey)}
        </h2>
      )}

      {isEditing && !readOnly ? (
        <div className={`space-y-4 ${hideTitle ? "" : "mt-4"}`}>
          <label htmlFor="address-section-input" className="sr-only">
            {t("address.label")}
          </label>
          <textarea
            id="address-section-input"
            rows={4}
            dir={inputDir}
            value={draftAddress}
            onChange={(e) => setDraftAddress(e.target.value)}
            className={`${inputClass} resize-y`}
          />
          {addressError ? (
            <p className="text-sm text-red-600" role="alert">
              {addressError}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void handleConfirmEdit()}
              disabled={updateProfileMutation.isPending}
              className={actionBtnClass}
            >
              {updateProfileMutation.isPending
                ? t("address.saving")
                : t("cart.checkout.confirm")}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={updateProfileMutation.isPending}
              className={secondaryBtnClass}
            >
              {t("cart.checkout.cancel")}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
              {displayAddress || t("cart.checkout.noAddress")}
            </p>
          </div>
          {!readOnly ? (
            <button
              type="button"
              onClick={handleStartEdit}
              className={`mt-4 ${actionBtnClass}`}
            >
              {t("cart.checkout.editAddress")}
            </button>
          ) : null}
        </div>
      )}
    </section>
  );
}

export function useCheckoutAddressReady() {
  const { data: profile, isPending } = useProfileQuery();
  const address = profile?.address?.trim() ?? "";
  return {
    isReady: !isPending && address.length > 0,
    address,
    isPending,
  };
}
