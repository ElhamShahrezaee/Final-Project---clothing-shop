import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth/useAuth";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <header className="flex items-center justify-between border-b pb-4">
          <div className="text-lg font-semibold tracking-wide">Admin</div>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                [
                  "hover:underline",
                  isActive ? "font-semibold underline" : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              Dashboard
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 hover:underline"
            >
              خروج
            </button>
          </nav>
        </header>

        <main className="py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

