import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAdminLocale } from "../../hooks/useAdminLocale";

const navItems = [
  { to: "/admin/dashboard", key: "dashboard" },
  { to: "/admin/products", key: "products" },
  { to: "/admin/inventory", key: "inventory" },
  { to: "/admin/orders", key: "orders" },
] as const;

function linkClass(isActive: boolean, textAlign: string) {
  return [
    "block rounded-lg px-3 py-2.5 text-sm transition",
    textAlign,
    isActive
      ? "bg-gray-900 font-medium text-white"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  ].join(" ");
}

export default function AdminSidebar() {
  const { t } = useTranslation();
  const { dir, textAlign } = useAdminLocale();

  return (
    <aside
      dir={dir}
      className={`flex h-full w-56 shrink-0 flex-col border-s border-gray-200 bg-white ${textAlign}`}
    >
      <div className="border-b border-gray-200 px-4 py-5">
        <p className="text-lg font-semibold tracking-wide text-gray-900">
          {t("admin.panelTitle")}
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ to, key }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => linkClass(isActive, textAlign)}
          >
            {t(`admin.nav.${key}`)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
