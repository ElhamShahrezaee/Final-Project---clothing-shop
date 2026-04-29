import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/products?search=${search}`);
    }
  };

  return (
    <div className="bg-black text-white p-4 flex items-center justify-between">
      {/* Links */}
      <div className="flex gap-6">
        <Link to="/">{t("nav.home")}</Link>
        <Link to="/products">{t("nav.products")}</Link>
        <Link to="/cart">{t("nav.cart")}</Link>
      </div>

      {/* Search + Lang */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={t("search.placeholder")}
          className="px-2 py-1 text-black rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-white text-black px-3 py-1 rounded"
        >
          {t("search.button")}
        </button>

        <button
          onClick={() => {
            const next = i18n.language === "fa" ? "en" : "fa";
            void i18n.changeLanguage(next);
          }}
          className="bg-yellow-400 text-black px-3 py-1 rounded"
        >
          {i18n.language === "fa" ? "EN" : "FA"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
