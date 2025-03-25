import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '/flags/tr.svg' },
    { code: 'en', name: 'English', flag: '/flags/gb.svg' },
    { code: 'ru', name: 'Русский', flag: '/flags/ru.svg' },
    { code: 'ka', name: 'ქართული', flag: '/flags/ge.svg' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 w-8 p-0 hover:bg-accent/50 transition-colors duration-200"
        >
          <img 
            src={currentLanguage.flag} 
            alt={currentLanguage.name}
            className="w-6 h-6 rounded-sm object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => i18n.changeLanguage(language.code)}
            className="flex items-center gap-2 cursor-pointer hover:bg-accent/50 transition-colors duration-200"
          >
            <img 
              src={language.flag} 
              alt={language.name}
              className="w-5 h-5 rounded-sm object-cover"
            />
            <span className="flex-1">{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}