import { useTranslation } from "react-i18next";

export function useAppLocale() {
  const { i18n } = useTranslation();
  const isFa = i18n.language === "fa";

  return {
    isFa,
    dir: isFa ? ("rtl" as const) : ("ltr" as const),
    textAlign: isFa ? "text-right" : "text-left",
  };
}
