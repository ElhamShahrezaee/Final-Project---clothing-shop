import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

const Header = () => {
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const submitSearch = () => {
    const q = search.trim();
    if (!q) return;
    navigate(`/products?search=${encodeURIComponent(q)}`);
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="text-xl font-bold tracking-widest">{t("app.brand")}</div>

        {/* Search */}
        <div className="flex-1 mx-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("search.placeholder")}
            className="w-full border rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
            onKeyDown={(e) => {
              if (e.key === "Enter") submitSearch();
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={submitSearch}
            className="border px-3 py-1 rounded-full hover:bg-black hover:text-white transition"
          >
            {t("search.button")}
          </button>

          {/* Language button */}
          <button
            onClick={() => {
              const next = i18n.language === "fa" ? "en" : "fa";
              void i18n.changeLanguage(next);
            }}
            className="border px-3 py-1 rounded-full hover:bg-black hover:text-white transition"
          >
            {i18n.language === "fa" ? "EN" : "FA"}
          </button>

          {/* Cart */}
          <button className="hover:underline">
            {t("nav.cart")}
          </button>

          {/* Login */}
          <button className="hover:underline">
            {t("nav.login")}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
