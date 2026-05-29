import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import { useAppLocale } from "../../../hooks/useAppLocale";
import { headerIconBtnClass } from "./headerNavStyles";

type HeaderSearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  compact?: boolean;
  fullWidth?: boolean;
  iconOnly?: boolean;
  iconActive?: boolean;
  onIconClick?: () => void;
};

export default function HeaderSearchField({
  value,
  onChange,
  onSubmit,
  compact,
  fullWidth,
  iconOnly,
  iconActive,
  onIconClick,
}: HeaderSearchFieldProps) {
  const { t } = useTranslation();
  const { isFa } = useAppLocale();

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={onIconClick}
        className={headerIconBtnClass}
        aria-label={t("search.button")}
        aria-expanded={iconActive}
      >
        <SearchIcon className="h-[22px] w-[22px]" aria-hidden />
      </button>
    );
  }

  return (
    <div
      dir="ltr"
      className={`flex w-full min-w-0 items-center gap-2 rounded-full border border-gray-900 text-sm ${
        isFa ? "flex-row-reverse pe-3 ps-4" : "flex-row ps-3 pe-4"
      } ${
        fullWidth
          ? "max-w-none py-2"
          : compact
            ? "max-w-[8.5rem] py-2 sm:max-w-[9.5rem]"
            : "max-w-sm py-2.5"
      }`}
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
