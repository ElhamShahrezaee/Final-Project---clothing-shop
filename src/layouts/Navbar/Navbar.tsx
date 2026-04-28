import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { LanguageContext } from "../../context/language/LanguageContext";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("LanguageContext must be used inside LanguageProvider");
  }

  const { lang, toggleLang } = context;

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/products?search=${search}`);
    }
  };

  return (
    <div className="bg-black text-white p-4 flex items-center justify-between">
      {/* Links */}
      <div className="flex gap-6">
        <Link to="/">{lang === "fa" ? "خانه" : "Home"}</Link>
        <Link to="/products">{lang === "fa" ? "محصولات" : "Products"}</Link>
        <Link to="/cart">{lang === "fa" ? "سبد خرید" : "Cart"}</Link>
      </div>

      {/* Search + Lang */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={lang === "fa" ? "جستجو..." : "Search..."}
          className="px-2 py-1 text-black rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-white text-black px-3 py-1 rounded"
        >
          {lang === "fa" ? "جستجو" : "Search"}
        </button>

        <button
          onClick={toggleLang}
          className="bg-yellow-400 text-black px-3 py-1 rounded"
        >
          {lang === "fa" ? "EN" : "FA"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
