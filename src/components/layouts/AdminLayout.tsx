import { Outlet, NavLink } from "react-router-dom";

export default function AdminLayout() {
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
          </nav>
        </header>

        <main className="py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

