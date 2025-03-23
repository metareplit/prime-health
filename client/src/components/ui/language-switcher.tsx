import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const languages = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ka', name: 'ქართული', flag: '🇬🇪' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language);

  return (
    <div className="relative z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-accent hover:text-accent-foreground min-w-[80px] justify-center transition-all duration-200 hover:shadow-md hover:scale-105"
          >
            <span className="text-xl">{currentLanguage?.flag}</span>
            <Globe className="h-4 w-4 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-[160px] mt-2 bg-background/95 backdrop-blur-sm border border-accent/20 shadow-lg animate-in slide-in-from-top-2"
        >
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gradient-to-r from-primary/10 to-accent/20 hover:text-primary transition-all duration-200 rounded-md mx-1 my-0.5"
            >
              <span className="text-2xl">{language.flag}</span>
              <span className="flex-1 text-sm font-medium">{language.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}