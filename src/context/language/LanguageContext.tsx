import { createContext } from "react";

export type LanguageType = "fa" | "en";

interface LanguageContextType {
  lang: LanguageType;
  toggleLang: () => void;
}

export const LanguageContext = createContext<LanguageContextType | null>(null);
