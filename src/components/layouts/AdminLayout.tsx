import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../context/auth/useAuth";
import { useAdminLocale } from "../../hooks/useAdminLocale";
import i18n from "../../i18n";
import brandLogo from "../../assets/images/Logo-ELISHA-STOR.svg.png";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const { logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { dir, textAlign, isFa } = useAdminLocale();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const toggleLanguage = () => {
    const next = i18n.language === "fa" ? "en" : "fa";
    void i18n.changeLanguage(next);
  };

  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <div className="flex h-screen w-full flex-row overflow-hidden bg-gray-50 text-gray-900">
      <div className={`flex min-h-0 min-w-0 w-full flex-1 flex-col ${textAlign}`} dir={dir}>
        <header
          dir={dir}
          className="relative flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 py-3 sm:gap-4 sm:px-6"
        >
          <div className="flex flex-1 items-center justify-start gap-2">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-300 text-gray-700 transition hover:bg-gray-100 lg:hidden"
              aria-label={t("admin.openMenu")}
              aria-expanded={mobileNavOpen}
            >
              <MenuIcon className="h-[22px] w-[22px]" aria-hidden />
            </button>
          </div>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="pointer-events-auto flex items-center"
            >
              <img
                src={brandLogo}
                alt={t("app.brand")}
                className="h-10 w-auto max-w-[140px] object-contain sm:h-14 sm:max-w-[280px]"
              />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-end gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-lg border border-gray-300 px-3 text-sm text-gray-700 transition hover:bg-gray-100"
              aria-label={t("admin.languageToggle")}
            >
              <LanguageIcon className="h-[22px] w-[22px]" aria-hidden />
              <span className="hidden sm:inline">
                {i18n.language === "fa" ? "EN" : "FA"}
              </span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-100 sm:px-4"
            >
              {t("admin.logout")}
            </button>
          </div>
        </header>

        <main
          className={`min-h-0 w-full min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 ${textAlign}`}
          dir={dir}
        >
          <Outlet />
        </main>
      </div>

      <AdminSidebar className="hidden shrink-0 lg:flex" />

      {mobileNavOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            aria-label={t("admin.closeMenu")}
            onClick={closeMobileNav}
          />
          <div
            className={[
              "fixed inset-y-0 z-50 flex lg:hidden",
              isFa ? "right-0" : "left-0",
            ].join(" ")}
          >
            <AdminSidebar className="h-full shadow-xl" onNavigate={closeMobileNav} />
            <button
              type="button"
              onClick={closeMobileNav}
              className={[
                "absolute top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm",
                isFa ? "left-3" : "right-3",
              ].join(" ")}
              aria-label={t("admin.closeMenu")}
            >
              <CloseIcon className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
