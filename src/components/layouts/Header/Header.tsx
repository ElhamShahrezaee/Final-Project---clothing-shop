import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";
import brandLogo from "../../../assets/images/Logo-ELISHA-STOR.svg.png";

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
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="grid grid-cols-3 items-center">
          {/* Left: Search */}
          <div className="flex items-center gap-2 justify-start">
            <div className="hidden sm:block w-full max-w-xs">
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

            <button
              onClick={submitSearch}
              className="border px-3 py-2 rounded-full hover:bg-black hover:text-white transition text-sm"
            >
              {t("search.button")}
            </button>
          </div>

          {/* Center: Logo */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex items-center"
            >
              <img
                src={brandLogo}
                alt={t("app.brand")}
                className="h-24 w-72 sm:h-28 sm:w-[28rem] object-contain"
              />
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4 justify-end text-sm">
            {/* Language button */}
            <button
              onClick={() => {
                const next = i18n.language === "fa" ? "en" : "fa";
                void i18n.changeLanguage(next);
              }}
              className="border px-3 py-2 rounded-full hover:bg-black hover:text-white transition"
            >
              {i18n.language === "fa" ? "EN" : "FA"}
            </button>

            <button className="hover:underline">{t("nav.cart")}</button>
            <button className="hover:underline">{t("nav.login")}</button>
          </div>
        </div>

        {/* Mobile search row */}
        <div className="sm:hidden mt-3">
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
      </div>
    </header>
  );
};

export default Header;
