import { useState } from "react";
import { LanguageContext } from "./LanguageContext";
import type { LanguageType } from "./LanguageContext";

const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<LanguageType>("fa");

  const toggleLang = () => {
    setLang((prev) => (prev === "fa" ? "en" : "fa"));
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
