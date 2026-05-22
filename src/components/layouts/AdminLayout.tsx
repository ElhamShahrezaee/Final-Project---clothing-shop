import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageIcon from "@mui/icons-material/Language";
import { useAuth } from "../../context/auth/useAuth";
import { useAdminLocale } from "../../hooks/useAdminLocale";
import i18n from "../../i18n";
import brandLogo from "../../assets/images/Logo-ELISHA-STOR.svg.png";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const { logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { dir, textAlign } = useAdminLocale();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const toggleLanguage = () => {
    const next = i18n.language === "fa" ? "en" : "fa";
    void i18n.changeLanguage(next);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900">
      <div className={`flex min-h-0 min-w-0 flex-1 flex-col ${textAlign}`} dir={dir}>
        <header
          dir="ltr"
          className="grid shrink-0 grid-cols-3 items-center gap-4 border-b border-gray-200 bg-white px-6 py-3 text-left"
        >
          <div className="flex items-center justify-start gap-2">
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
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
            >
              {t("admin.logout")}
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
                className="h-12 w-auto max-w-[200px] object-contain sm:h-14 sm:max-w-[280px]"
              />
            </button>
          </div>

          <div />
        </header>

        <main className={`flex min-h-0 flex-1 flex-col overflow-hidden p-6 ${textAlign}`} dir={dir}>
          <Outlet />
        </main>
      </div>

      <AdminSidebar />
    </div>
  );
}
