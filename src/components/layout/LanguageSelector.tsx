import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

export function LanguageSelector() {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-md border border-border bg-background/50 p-1">
      <Button
        variant={currentLanguage === "en" ? "default" : "ghost"}
        size="sm"
        onClick={() => changeLanguage("en")}
        className={cn(
          "h-7 px-3 text-xs font-medium",
          currentLanguage === "en" && "bg-primary text-primary-foreground"
        )}
      >
        EN
      </Button>
      <Button
        variant={currentLanguage === "vi" ? "default" : "ghost"}
        size="sm"
        onClick={() => changeLanguage("vi")}
        className={cn(
          "h-7 px-3 text-xs font-medium",
          currentLanguage === "vi" && "bg-primary text-primary-foreground"
        )}
      >
        VI
      </Button>
    </div>
  );
}

