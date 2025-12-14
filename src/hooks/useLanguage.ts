import { useTranslation } from "react-i18next";

export type Language = "en" | "vi";

export function useLanguage() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: Language) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = i18n.language as Language;

  return {
    currentLanguage,
    changeLanguage,
    isEnglish: currentLanguage === "en",
    isVietnamese: currentLanguage === "vi",
  };
}

