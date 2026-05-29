import { useTranslation } from "react-i18next";
import AddressSection from "../../../components/address/AddressSection";
import { useToast } from "../../../context/toast/ToastContext";
import { useAppLocale } from "../../../hooks/useAppLocale";

export default function AddressPage() {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const { dir, textAlign } = useAppLocale();

  return (
    <div dir={dir} className={`mx-auto max-w-2xl px-4 py-8 sm:py-10 ${textAlign}`}>
      <h1 className="mb-8 text-2xl font-semibold text-gray-900 sm:text-3xl">
        {t("address.title")}
      </h1>

      <AddressSection
        titleKey="address.title"
        hideTitle
        onAddressSaved={() => showToast(t("address.toast.saved"))}
      />
    </div>
  );
}
