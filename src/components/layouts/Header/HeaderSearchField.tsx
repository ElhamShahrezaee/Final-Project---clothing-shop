import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import { useAppLocale } from "../../../hooks/useAppLocale";

type HeaderSearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  compact?: boolean;
};

export default function HeaderSearchField({
  value,
  onChange,
  onSubmit,
  compact,
}: HeaderSearchFieldProps) {
  const { t } = useTranslation();
  const { isFa } = useAppLocale();

  return (
    <div
      dir="ltr"
      className={`flex w-full items-center gap-2 rounded-full border border-gray-900 text-sm ${
        isFa ? "flex-row-reverse pe-3 ps-4" : "flex-row ps-3 pe-4"
      } ${compact ? "max-w-[8.5rem] py-2 sm:max-w-[9.5rem]" : "max-w-sm py-2.5"}`}
    >
      <SearchIcon className="h-[18px] w-[18px] shrink-0 text-gray-700" aria-hidden />
      <input
        type="text"
        inputMode="search"
        enterKeyHint="search"
        dir={isFa ? "rtl" : "ltr"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("search.placeholder")}
        aria-label={t("search.button")}
        className={`min-w-0 flex-1 border-0 bg-transparent outline-none ${
          isFa ? "text-right" : "text-left"
        }`}
        style={{ textAlign: isFa ? "right" : "left" }}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit();
        }}
      />
    </div>
  );
}
