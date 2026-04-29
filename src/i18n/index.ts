import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./resources/en.json";
import fa from "./resources/fa.json";

const STORAGE_KEY = "app_lang";

const defaultLanguage = "fa";
const savedLanguage = localStorage.getItem(STORAGE_KEY);
const initialLanguage =
  savedLanguage === "en" || savedLanguage === "fa" ? savedLanguage : defaultLanguage;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fa: { translation: fa },
  },
  lng: initialLanguage,
  fallbackLng: defaultLanguage,
  interpolation: { escapeValue: false },
});

function applyDocumentLanguage(lang: string) {
  // Keep the layout direction stable to avoid UI mirroring.
  // We only switch the language, not the document direction.
  document.documentElement.lang = lang;
  document.documentElement.dir = "ltr";
}

applyDocumentLanguage(i18n.language);

i18n.on("languageChanged", (lang) => {
  localStorage.setItem(STORAGE_KEY, lang);
  applyDocumentLanguage(lang);
});

export default i18n;
