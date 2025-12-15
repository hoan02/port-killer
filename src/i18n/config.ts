import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "./locales/en.json";
import viTranslations from "./locales/vi.json";

const LANGUAGE_STORAGE_KEY = "open-port-language";

// Detect system language
const getSystemLanguage = (): string => {
  if (typeof window === "undefined") {
    return "en";
  }

  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && (stored === "en" || stored === "vi")) {
      return stored;
    }
  } catch (error) {
    console.error("Error reading language from localStorage:", error);
  }
  
  const systemLang = navigator.language.toLowerCase();
  return systemLang.startsWith("vi") ? "vi" : "en";
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      vi: {
        translation: viTranslations,
      },
    },
    lng: getSystemLanguage(),
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

// Listen for language changes and persist
i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    } catch (error) {
      console.error("Error saving language to localStorage:", error);
    }
  }
});

export default i18n;

