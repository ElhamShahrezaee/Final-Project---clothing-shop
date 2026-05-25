import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useUserAuth } from "../../../context/auth/useUserAuth";
import { getUserDisplayName } from "../../../features/auth/utils/getUserDisplayName";
import { useAppLocale } from "../../../hooks/useAppLocale";
import {
  headerIconBtnClass,
  headerIconClass,
  headerOutlinedBtnClass,
} from "./headerNavStyles";

const iconBtnClass = headerIconBtnClass;
const iconClass = headerIconClass;

type HeaderUserMenuProps = {
  compact?: boolean;
};

type MenuPosition = {
  top: number;
  left?: number;
  right?: number;
};

export default function HeaderUserMenu({ compact }: HeaderUserMenuProps) {
  const { t } = useTranslation();
  const { isFa } = useAppLocale();
  const { user, logout } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const displayName = getUserDisplayName(user?.name, t("auth.defaultUser"), 10);

  const updateMenuPosition = () => {
    const el = rootRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const gap = 8;

    setMenuPosition(
      isFa
        ? { top: rect.bottom + gap, right: Math.max(8, window.innerWidth - rect.right) }
        : { top: rect.bottom + gap, left: Math.max(8, rect.left) },
    );
  };

  useLayoutEffect(() => {
    if (!open) {
      setMenuPosition(null);
      return;
    }

    updateMenuPosition();

    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
    };
  }, [open, isFa]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if ((event.target as HTMLElement).closest("[data-user-menu-dropdown]")) return;
      setOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleLogout = () => {
    logout();
    setOpen(false);

    if (location.pathname.startsWith("/account")) {
      navigate("/", { replace: true });
    }
  };

  const menuItems = [
    { key: "profile", label: t("auth.menuProfile"), path: "/account/profile" },
    { key: "orders", label: t("auth.menuOrders"), path: "/account/orders" },
    { key: "addresses", label: t("auth.menuAddresses"), path: "/account/addresses" },
  ] as const;

  const triggerClass = compact
    ? `${iconBtnClass} max-w-[2.75rem]`
    : `${headerOutlinedBtnClass} min-w-[5.5rem] max-w-[7.5rem]`;

  const menuItemAlign = isFa ? "text-right" : "text-left";

  const dropdown =
    open && menuPosition
      ? createPortal(
          <div
            data-user-menu-dropdown
            role="menu"
            dir={isFa ? "rtl" : "ltr"}
            style={{
              position: "fixed",
              top: menuPosition.top,
              left: menuPosition.left,
              right: menuPosition.right,
              zIndex: 100,
            }}
            className="min-w-[11rem] rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
          >
            {menuItems.map((item) => (
              <button
                key={item.key}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  navigate(item.path);
                }}
                className={`block w-full px-4 py-2.5 text-sm text-gray-800 transition hover:bg-gray-100 ${menuItemAlign}`}
              >
                {item.label}
              </button>
            ))}
            <div className="my-1 border-t border-gray-100" />
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className={`block w-full px-4 py-2.5 text-sm text-red-700 transition hover:bg-red-50 ${menuItemAlign}`}
            >
              {t("auth.menuLogout")}
            </button>
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={triggerClass}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <PersonOutlinedIcon className={iconClass} aria-hidden />
        {!compact && <span className="truncate">{displayName}</span>}
      </button>
      {dropdown}
    </div>
  );
}
