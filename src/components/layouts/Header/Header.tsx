import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import i18n from "../../../i18n";
import brandLogo from "../../../assets/images/Logo-ELISHA-STOR.svg.png";

const iconClass = "h-[22px] w-[22px] shrink-0";

const searchInputClass =
  "w-full rounded-full border border-gray-900 px-4 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

const navBtnClass =
  "inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full border border-gray-900 px-3 text-sm transition hover:bg-gray-900 hover:text-white";

const iconBtnClass =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center transition hover:opacity-70";

const navTextBtnClass =
  "inline-flex h-10 shrink-0 items-center justify-center gap-1.5 text-sm transition hover:opacity-70";

export default function Header() {
  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const submitSearch = () => {
    const q = search.trim();
    if (!q) return;
    navigate(`/products?search=${encodeURIComponent(q)}`);
    setMobileSearchOpen(false);
  };

  const toggleLanguage = () => {
    const next = i18n.language === "fa" ? "en" : "fa";
    void i18n.changeLanguage(next);
  };

  return (
    <header
      dir="ltr"
      className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white text-left"
    >
      <div className="mx-auto max-w-6xl px-4 py-[0.7rem]">
        {/* Mobile */}
        <div className="flex items-center justify-between sm:hidden">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex shrink-0 items-center"
            aria-label={t("app.brand")}
          >
            <img
              src={brandLogo}
              alt={t("app.brand")}
              className="h-10 w-28 object-contain"
            />
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMobileSearchOpen((open) => !open)}
              className={iconBtnClass}
              aria-label={t("search.button")}
              aria-expanded={mobileSearchOpen}
            >
              <SearchIcon className={iconClass} aria-hidden />
            </button>

            <button
              type="button"
              onClick={toggleLanguage}
              className={iconBtnClass}
              aria-label={i18n.language === "fa" ? "English" : "فارسی"}
            >
              <LanguageIcon className={iconClass} aria-hidden />
            </button>

            <button type="button" className={iconBtnClass} aria-label={t("nav.cart")}>
              <ShoppingCartOutlinedIcon className={iconClass} aria-hidden />
            </button>

            <button type="button" className={iconBtnClass} aria-label={t("nav.login")}>
              <PersonOutlinedIcon className={iconClass} aria-hidden />
            </button>
          </div>
        </div>

        {mobileSearchOpen && (
          <div className="mt-2 flex gap-2 sm:hidden">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search.placeholder")}
              className={`min-w-0 flex-1 ${searchInputClass}`}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitSearch();
              }}
            />
            <button
              type="button"
              onClick={submitSearch}
              className={`${navBtnClass} w-10 px-0`}
              aria-label={t("search.button")}
            >
              <SearchIcon className={iconClass} aria-hidden />
            </button>
          </div>
        )}

        {/* Desktop */}
        <div className="hidden grid-cols-3 items-center sm:grid">
          <div className="flex items-center justify-start gap-2">
            <div className="w-full max-w-xs">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("search.placeholder")}
                className={searchInputClass}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitSearch();
                }}
              />
            </div>

            <button
              type="button"
              onClick={submitSearch}
              className={`${navBtnClass} min-w-[5.5rem]`}
            >
              <SearchIcon className={iconClass} aria-hidden />
              <span>{t("search.button")}</span>
            </button>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center"
            >
              <img
                src={brandLogo}
                alt={t("app.brand")}
                className="h-[4.2rem] w-[12.6rem] object-contain sm:h-[4.9rem] sm:w-[19.6rem]"
              />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 text-sm">
            <button
              type="button"
              onClick={toggleLanguage}
              className={`${navBtnClass} w-[5.25rem]`}
            >
              <LanguageIcon className={iconClass} aria-hidden />
              <span className="w-7 text-center">
                {i18n.language === "fa" ? "EN" : "FA"}
              </span>
            </button>

            <button
              type="button"
              className={`${navTextBtnClass} w-[6.5rem]`}
            >
              <ShoppingCartOutlinedIcon className={iconClass} aria-hidden />
              <span className="truncate">{t("nav.cart")}</span>
            </button>

            <button
              type="button"
              className={`${navTextBtnClass} w-[9rem]`}
            >
              <PersonOutlinedIcon className={iconClass} aria-hidden />
              <span className="truncate">{t("nav.login")}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
