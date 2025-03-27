import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";

const languages = [
  { 
    code: 'tr', 
    name: 'Türkçe', 
    flag: '/flags/tr.svg'
  },
  { 
    code: 'en', 
    name: 'English',
    flag: '/flags/gb.svg'
  },
  { 
    code: 'ru', 
    name: 'Русский',
    flag: '/flags/ru.svg'
  },
  { 
    code: 'ka', 
    name: 'ქართული',
    flag: '/flags/ge.svg'
  },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [location, setLocation] = useLocation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
    
    // Update URL to include language prefix
    const pathParts = location.split('/').filter(Boolean);
    
    // Remove current language prefix if it exists
    if (pathParts.length > 0 && ['tr', 'en', 'ru', 'ka'].includes(pathParts[0])) {
      pathParts.shift();
    }
    
    // Create new path with the selected language prefix
    const newPath = `/${lng}${pathParts.length > 0 ? '/' + pathParts.join('/') : ''}`;
    setLocation(newPath);
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
            <img 
              src={currentLanguage?.flag} 
              alt={currentLanguage?.name}
              className="w-6 h-6 rounded-full object-cover"
            />
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
              <img 
                src={language.flag} 
                alt={language.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="flex-1 text-sm font-medium">{language.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}