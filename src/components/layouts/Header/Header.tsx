import { useState } from "react";

const Header = () => {
  const [lang, setLang] = useState<"fa" | "en">("fa");
  const [search, setSearch] = useState("");

  const toggleLang = () => {
    setLang((prev) => (prev === "fa" ? "en" : "fa"));
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="text-xl font-bold tracking-widest">Z-STORE</div>

        {/* Search */}
        <div className="flex-1 mx-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={lang === "fa" ? "جستجو..." : "Search..."}
            className="w-full border rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 text-sm">
          {/* Language button */}
          <button
            onClick={toggleLang}
            className="border px-3 py-1 rounded-full hover:bg-black hover:text-white transition"
          >
            {lang === "fa" ? "EN" : "FA"}
          </button>

          {/* Cart */}
          <button className="hover:underline">
            {lang === "fa" ? "سبد خرید" : "Cart"}
          </button>

          {/* Login */}
          <button className="hover:underline">
            {lang === "fa" ? "ورود" : "Login"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
