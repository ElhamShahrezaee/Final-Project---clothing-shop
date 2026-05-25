import { useTranslation } from "react-i18next";
import { useAppLocale } from "../../hooks/useAppLocale";

type AccountPlaceholderProps = {
  titleKey: "auth.account.profileTitle" | "auth.account.ordersTitle" | "auth.account.addressesTitle";
};

export default function AccountPlaceholder({ titleKey }: AccountPlaceholderProps) {
  const { t } = useTranslation();
  const { dir, textAlign } = useAppLocale();

  return (
    <div dir={dir} className={`mx-auto max-w-2xl px-4 py-10 ${textAlign}`}>
      <h1 className="text-2xl font-semibold text-gray-900">{t(titleKey)}</h1>
      <p className="mt-3 text-sm text-gray-600">{t("auth.account.comingSoon")}</p>
    </div>
  );
}
