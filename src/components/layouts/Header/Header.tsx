import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageIcon from "@mui/icons-material/Language";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import i18n from "../../../i18n";
import { useUserAuth } from "../../../context/auth/useUserAuth";
import { buildLoginPath } from "../../../lib/auth/returnUrl";
import { useCartQuery } from "../../../features/cart/queries/useCartQuery";
import { getCartUniqueItemsCount } from "../../../features/cart/utils/cartSelectors";
import { formatCount } from "../../../lib/formatCount";
import { useAppLocale } from "../../../hooks/useAppLocale";
import brandLogo from "../../../assets/images/Logo-ELISHA-STOR.svg.png";
import HeaderSearchField from "./HeaderSearchField";
import HeaderUserMenu from "./HeaderUserMenu";
import MiniCartPopover from "./MiniCartPopover";
import {
  headerIconBtnClass,
  headerIconClass,
  headerOutlinedBtnClass,
  headerPlainBtnClass,
} from "./headerNavStyles";

const iconClass = headerIconClass;
const iconBtnClass = headerIconBtnClass;
const cartBtnClass = `${headerPlainBtnClass} justify-start gap-1.5`;

type HeaderLanguageButtonProps = {
  compact?: boolean;
  onToggle: () => void;
};

function HeaderLanguageButton({ compact, onToggle }: HeaderLanguageButtonProps) {
  if (compact) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className={iconBtnClass}
        aria-label={i18n.language === "fa" ? "English" : "فارسی"}
      >
        <LanguageIcon className={iconClass} aria-hidden />
      </button>
    );
  }

  return (
    <button type="button" onClick={onToggle} className={`${headerOutlinedBtnClass} w-[5.25rem]`}>
      <LanguageIcon className={iconClass} aria-hidden />
      <span className="w-7 text-center">{i18n.language === "fa" ? "EN" : "FA"}</span>
    </button>
  );
}

type HeaderNavActionsProps = {
  compact?: boolean;
  isUserLoggedIn: boolean;
  onLoginClick: () => void;
  onCartClick: () => void;
};

function HeaderNavActions({
  compact,
  isUserLoggedIn,
  onLoginClick,
  onCartClick,
}: HeaderNavActionsProps) {
  const { t } = useTranslation();
  const { isFa } = useAppLocale();
  const { data: cart } = useCartQuery();
  const totalQty = getCartUniqueItemsCount(cart);
  const [miniOpen, setMiniOpen] = useState(false);
  const location = useLocation();
  const closeTimeoutRef = useRef<number | null>(null);

  const shouldForceMiniOpen = new URLSearchParams(location.search).get("cart") === "1";
  useEffect(() => {
    if (!compact && shouldForceMiniOpen) setMiniOpen(true);
  }, [compact, shouldForceMiniOpen]);

  const cartIcon = (
    <span className="relative inline-flex items-center justify-center">
      {totalQty > 0 ? (
        <span className="absolute bottom-full left-1/2 z-0 inline-flex h-5 min-w-5 -translate-x-1/2 translate-y-2 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-semibold text-white">
          {formatCount(totalQty, isFa)}
        </span>
      ) : null}
      <ShoppingCartOutlinedIcon className={`${iconClass} relative z-10`} aria-hidden />
    </span>
  );

  const cartButton = compact ? (
    <button type="button" onClick={onCartClick} className={iconBtnClass} aria-label={t("nav.cart")}>
      {cartIcon}
    </button>
  ) : (
    <div
      className="relative"
      onMouseEnter={() => {
        if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
        setMiniOpen(true);
      }}
      onMouseLeave={() => {
        if (closeTimeoutRef.current) window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = window.setTimeout(() => setMiniOpen(false), 500);
      }}
    >
      <button type="button" onClick={onCartClick} className={cartBtnClass}>
        {cartIcon}
        <span className="truncate">{t("nav.cart")}</span>
      </button>
      {totalQty > 0 ? <MiniCartPopover open={miniOpen} onClose={() => setMiniOpen(false)} /> : null}
    </div>
  );

  const loginButton = compact ? (
    <button type="button" onClick={onLoginClick} className={iconBtnClass} aria-label={t("nav.login")}>
      <PersonOutlinedIcon className={iconClass} aria-hidden />
    </button>
  ) : (
    <button type="button" onClick={onLoginClick} className={headerPlainBtnClass}>
      <PersonOutlinedIcon className={iconClass} aria-hidden />
      <span className="truncate">{t("nav.login")}</span>
    </button>
  );

  const userOrLogin = isUserLoggedIn ? (
    <HeaderUserMenu compact={compact} />
  ) : (
    loginButton
  );

  return (
    <div className="flex items-center gap-2">
      {userOrLogin}
      {cartButton}
    </div>
  );
}

type HeaderRightSectionProps = {
  compact?: boolean;
  onLanguageToggle: () => void;
  children?: ReactNode;
};

/** Right side of header: main actions in one div, language toggle in a separate div. */
function HeaderRightSection({ compact, onLanguageToggle, children }: HeaderRightSectionProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      {children ? (
        <div className="flex items-center gap-1 sm:gap-2">{children}</div>
      ) : null}
      <div className="flex shrink-0 items-center">
        <HeaderLanguageButton compact={compact} onToggle={onLanguageToggle} />
      </div>
    </div>
  );
}

export default function Header() {
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const { isAuthenticated: isUserLoggedIn } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submitSearch = () => {
    const q = search.trim();
    if (!q) return;
    navigate(`/products?search=${encodeURIComponent(q)}`);
  };

  const toggleLanguage = () => {
    const next = i18n.language === "fa" ? "en" : "fa";
    void i18n.changeLanguage(next);
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleLoginClick = () => {
    const returnPath = `${location.pathname}${location.search}`;
    navigate(buildLoginPath(returnPath));
  };

  return (
    <header
      dir="ltr"
      className="fixed inset-x-0 top-0 z-50 overflow-visible border-b border-gray-200 bg-white text-left"
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
            <img src={brandLogo} alt={t("app.brand")} className="h-10 w-28 object-contain" />
          </button>

          <HeaderRightSection compact onLanguageToggle={toggleLanguage}>
            <HeaderSearchField
              compact
              value={search}
              onChange={setSearch}
              onSubmit={submitSearch}
            />
            <HeaderNavActions
              compact
              isUserLoggedIn={isUserLoggedIn}
              onLoginClick={handleLoginClick}
              onCartClick={handleCartClick}
            />
          </HeaderRightSection>
        </div>

        {/* Desktop: nav left | logo center | search + language right */}
        <div className="hidden grid-cols-3 items-center sm:grid">
          <HeaderNavActions
            isUserLoggedIn={isUserLoggedIn}
            onLoginClick={handleLoginClick}
            onCartClick={handleCartClick}
          />
          <div className="flex justify-center">
            <button type="button" onClick={() => navigate("/")} className="flex items-center">
              <img
                src={brandLogo}
                alt={t("app.brand")}
                className="h-[4.2rem] w-[12.6rem] object-contain sm:h-[4.9rem] sm:w-[19.6rem]"
              />
            </button>
          </div>
          <HeaderRightSection onLanguageToggle={toggleLanguage}>
            <HeaderSearchField
              value={search}
              onChange={setSearch}
              onSubmit={submitSearch}
            />
          </HeaderRightSection>
        </div>
      </div>
    </header>
  );
}
