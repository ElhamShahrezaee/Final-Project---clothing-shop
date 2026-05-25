import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import i18n from "../../../i18n";
import { useUserAuth } from "../../../context/auth/useUserAuth";
import { useAppLocale } from "../../../hooks/useAppLocale";
import { buildLoginPath } from "../../../lib/auth/returnUrl";
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

type HeaderSearchProps = {
  search: string;
  onSearchChange: (value: string) => void;
  onSubmit: () => void;
  compact?: boolean;
};

function HeaderSearch({ search, onSearchChange, onSubmit, compact }: HeaderSearchProps) {
  const { t } = useTranslation();

  if (compact) {
    return (
      <button
        type="button"
        onClick={onSubmit}
        className={iconBtnClass}
        aria-label={t("search.button")}
      >
        <SearchIcon className={iconClass} aria-hidden />
      </button>
    );
  }

  return (
    <>
      <div className="w-full max-w-xs">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t("search.placeholder")}
          className={searchInputClass}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit();
          }}
        />
      </div>
      <button type="button" onClick={onSubmit} className={`${navBtnClass} min-w-[5.5rem]`}>
        <SearchIcon className={iconClass} aria-hidden />
        <span>{t("search.button")}</span>
      </button>
    </>
  );
}

type HeaderNavActionsProps = {
  compact?: boolean;
  onLanguageToggle: () => void;
  onLoginClick: () => void;
  onCartClick: () => void;
};

function HeaderNavActions({
  compact,
  onLanguageToggle,
  onLoginClick,
  onCartClick,
}: HeaderNavActionsProps) {
  const { t } = useTranslation();

  const languageButton = compact ? (
    <button
      type="button"
      onClick={onLanguageToggle}
      className={iconBtnClass}
      aria-label={i18n.language === "fa" ? "English" : "فارسی"}
    >
      <LanguageIcon className={iconClass} aria-hidden />
    </button>
  ) : (
    <button type="button" onClick={onLanguageToggle} className={`${navBtnClass} w-[5.25rem]`}>
      <LanguageIcon className={iconClass} aria-hidden />
      <span className="w-7 text-center">{i18n.language === "fa" ? "EN" : "FA"}</span>
    </button>
  );

  const cartButton = compact ? (
    <button type="button" onClick={onCartClick} className={iconBtnClass} aria-label={t("nav.cart")}>
      <ShoppingCartOutlinedIcon className={iconClass} aria-hidden />
    </button>
  ) : (
    <button type="button" onClick={onCartClick} className={`${navTextBtnClass} w-[6.5rem]`}>
      <ShoppingCartOutlinedIcon className={iconClass} aria-hidden />
      <span className="truncate">{t("nav.cart")}</span>
    </button>
  );

  const loginButton = compact ? (
    <button type="button" onClick={onLoginClick} className={iconBtnClass} aria-label={t("nav.login")}>
      <PersonOutlinedIcon className={iconClass} aria-hidden />
    </button>
  ) : (
    <button type="button" onClick={onLoginClick} className={`${navTextBtnClass} w-[9rem]`}>
      <PersonOutlinedIcon className={iconClass} aria-hidden />
      <span className="truncate">{t("nav.login")}</span>
    </button>
  );

  const buttons = [languageButton, loginButton, cartButton];

  return <div className="flex items-center gap-2">{buttons}</div>;
}

export default function Header() {
  const [search, setSearch] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { t } = useTranslation();
  const { isFa } = useAppLocale();
  const { isAuthenticated: isUserLoggedIn } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleLoginClick = () => {
    if (isUserLoggedIn) {
      navigate("/");
      return;
    }

    const returnPath = `${location.pathname}${location.search}`;
    navigate(buildLoginPath(returnPath));
  };

  const handleMobileSearchToggle = () => {
    setMobileSearchOpen((open) => !open);
  };

  return (
    <header
      dir="ltr"
      className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white text-left"
    >
      <div className="mx-auto max-w-6xl px-4 py-[0.7rem]">
        {/* Mobile */}
        <div className="flex items-center justify-between sm:hidden">
          {isFa ? (
            <>
              <HeaderNavActions
                compact
                onLanguageToggle={toggleLanguage}
                onLoginClick={handleLoginClick}
                onCartClick={handleCartClick}
              />
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
              <button
                type="button"
                onClick={handleMobileSearchToggle}
                className={iconBtnClass}
                aria-label={t("search.button")}
                aria-expanded={mobileSearchOpen}
              >
                <SearchIcon className={iconClass} aria-hidden />
              </button>
            </>
          ) : (
            <>
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
                  onClick={handleMobileSearchToggle}
                  className={iconBtnClass}
                  aria-label={t("search.button")}
                  aria-expanded={mobileSearchOpen}
                >
                  <SearchIcon className={iconClass} aria-hidden />
                </button>
                <HeaderNavActions
                  compact
                  onLanguageToggle={toggleLanguage}
                  onLoginClick={handleLoginClick}
                  onCartClick={handleCartClick}
                />
              </div>
            </>
          )}
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
          {isFa ? (
            <>
              <HeaderNavActions
                onLanguageToggle={toggleLanguage}
                onLoginClick={handleLoginClick}
                onCartClick={handleCartClick}
              />
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
              <div className="flex items-center justify-end gap-2">
                <HeaderSearch
                  search={search}
                  onSearchChange={setSearch}
                  onSubmit={submitSearch}
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-start gap-2">
                <HeaderSearch
                  search={search}
                  onSearchChange={setSearch}
                  onSubmit={submitSearch}
                />
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
              <HeaderNavActions
                onLanguageToggle={toggleLanguage}
                onLoginClick={handleLoginClick}
                onCartClick={handleCartClick}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
