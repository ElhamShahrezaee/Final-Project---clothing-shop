import { useTranslation } from "react-i18next";
import LanguageIcon from "@mui/icons-material/Language";
import i18n from "../../i18n";
export default function AuthLanguageToggle() {
  const { t } = useTranslation();

  const toggleLanguage = () => {
    const next = i18n.language === "fa" ? "en" : "fa";
    void i18n.changeLanguage(next);
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      dir="ltr"
      className="fixed right-4 top-4 z-10 inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 shadow-sm transition hover:bg-gray-100 sm:top-6"
      aria-label={t("admin.languageToggle")}
    >
      <LanguageIcon className="h-[22px] w-[22px]" aria-hidden />
      <span>{i18n.language === "fa" ? "EN" : "FA"}</span>
    </button>
  );
}
