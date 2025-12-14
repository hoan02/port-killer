import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "port-killer-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && (stored === "light" || stored === "dark" || stored === "system")) {
        return stored as Theme;
      }
    } catch (error) {
      console.error("Error reading theme from localStorage:", error);
    }
    
    return "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return theme;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const root = document.documentElement;
    
    const applyTheme = (isDark: boolean) => {
      setResolvedTheme(isDark ? "dark" : "light");
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };
    
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
        const isDark = e.matches;
        applyTheme(isDark);
      };
      
      // Apply initial theme
      updateTheme(mediaQuery);
      
      // Listen for changes
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", updateTheme);
        return () => mediaQuery.removeEventListener("change", updateTheme);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(updateTheme);
        return () => mediaQuery.removeListener(updateTheme);
      }
    } else {
      applyTheme(theme === "dark");
    }
  }, [theme]);

  const setThemeValue = (newTheme: Theme) => {
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch (error) {
        console.error("Error saving theme to localStorage:", error);
      }
    }
  };

  return {
    theme,
    resolvedTheme,
    setTheme: setThemeValue,
  };
}

