import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/auth/useAuth";
import { useAdminLocale } from "../../hooks/useAdminLocale";
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

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900">
      <div className={`flex min-h-0 min-w-0 flex-1 flex-col ${textAlign}`} dir={dir}>
        <header
          dir={dir}
          className="grid shrink-0 grid-cols-3 items-center gap-4 border-b border-gray-200 bg-white px-6 py-3"
        >
          <div />

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

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
            >
              خروج
            </button>
          </div>
        </header>

        <main className={`flex min-h-0 flex-1 flex-col overflow-hidden p-6 ${textAlign}`} dir={dir}>
          <Outlet />
        </main>
      </div>

      <AdminSidebar />
    </div>
  );
}
