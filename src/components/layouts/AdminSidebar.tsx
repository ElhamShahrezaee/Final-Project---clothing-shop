import { NavLink } from "react-router-dom";
import { useAdminLocale } from "../../hooks/useAdminLocale";

const navItems = [
  { to: "/admin/dashboard", label: "داشبورد" },
  { to: "/admin/products", label: "محصولات" },
  { to: "/admin/inventory", label: "موجودی/قیمت" },
  { to: "/admin/orders", label: "سفارشات" },
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
  const { dir, textAlign } = useAdminLocale();

  return (
    <aside
      dir={dir}
      className={`flex w-56 shrink-0 flex-col border-s border-gray-200 bg-white ${textAlign}`}
    >
      <div className="border-b border-gray-200 px-4 py-5">
        <p className="text-lg font-semibold tracking-wide text-gray-900">پنل ادمین</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => linkClass(isActive, textAlign)}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
