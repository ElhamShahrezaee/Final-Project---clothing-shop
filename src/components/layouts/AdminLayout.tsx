import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";
import { useAdminLocale } from "../../hooks/useAdminLocale";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { dir, textAlign } = useAdminLocale();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <div className={`flex min-w-0 flex-1 flex-col ${textAlign}`} dir={dir}>
        <header
          dir={dir}
          className={`flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 ${textAlign}`}
        >
          <p className="text-sm text-gray-500">ELISHA-STOR</p>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100"
          >
            خروج
          </button>
        </header>

        <main className={`flex-1 p-6 ${textAlign}`} dir={dir}>
          <Outlet />
        </main>
      </div>

      <AdminSidebar />
    </div>
  );
}
