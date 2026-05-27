import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../../components/common/Spinner/Spinner";
import { useToast } from "../../../context/toast/ToastContext";
import { useUpdateProfileMutation } from "../../../features/profile/mutations/useUpdateProfileMutation";
import { useProfileQuery } from "../../../features/profile/queries/useProfileQuery";
import { useAppLocale } from "../../../hooks/useAppLocale";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

const sectionClass = "rounded-xl border border-gray-200 bg-white p-6 shadow-sm";

export default function AddressPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { isFa, dir, textAlign } = useAppLocale();
  const { data: profile, isPending, isError, refetch } = useProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();

  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState<string | null>(null);

  const inputDir = isFa ? "rtl" : "ltr";

  useEffect(() => {
    if (!profile) return;
    setAddress(profile.address ?? "");
  }, [profile]);

  const validateAddressField = (): string | null => {
    if (!address.trim()) return t("address.validation.required");
    return null;
  };

  const handleAddressSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddressError(null);

    const validationError = validateAddressField();
    if (validationError) {
      setAddressError(validationError);
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({ address: address.trim() });
      showToast(t("address.toast.saved"));
    } catch (err) {
      setAddressError(err instanceof Error ? err.message : t("address.error.update"));
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div dir={dir} className={`mx-auto max-w-2xl px-4 py-12 ${textAlign}`}>
        <p className="text-sm text-red-600" role="alert">
          {t("address.error.load")}
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-4 rounded-full border border-gray-900 px-5 py-2 text-sm font-medium transition hover:bg-gray-900 hover:text-white"
        >
          {t("address.retry")}
        </button>
      </div>
    );
  }

  return (
    <div dir={dir} className={`mx-auto max-w-2xl px-4 py-8 sm:py-10 ${textAlign}`}>
      <h1 className="mb-8 text-2xl font-semibold text-gray-900 sm:text-3xl">
        {t("address.title")}
      </h1>

      <section className={sectionClass} aria-labelledby="address-form-heading">
        <h2 id="address-form-heading" className="sr-only">
          {t("address.title")}
        </h2>

        <form onSubmit={handleAddressSubmit} className="space-y-4">
          <div>
            <label htmlFor="userAddress" className="mb-1.5 block text-sm font-medium text-gray-700">
              {t("address.label")}
            </label>
            <textarea
              id="userAddress"
              rows={4}
              dir={inputDir}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`${inputClass} resize-y`}
            />
          </div>

          {addressError ? (
            <p className="text-sm text-red-600" role="alert">
              {addressError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="inline-flex h-11 items-center justify-center rounded-full border border-gray-900 px-6 text-sm font-medium transition hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updateProfileMutation.isPending ? t("address.saving") : t("address.save")}
          </button>
        </form>
      </section>
    </div>
  );
}
