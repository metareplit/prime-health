import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useLocation, useRouter } from 'wouter';
import { useTranslation } from 'react-i18next';

// Supported languages
export const supportedLanguages = ['tr', 'en', 'ru', 'ka'];

interface LanguageRouterContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  translatePath: (path: string) => string;
}

const LanguageRouterContext = createContext<LanguageRouterContextType | undefined>(undefined);

interface LanguageRouterProps {
  children: ReactNode;
}

export const LanguageRouter: React.FC<LanguageRouterProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [location, setLocation] = useLocation();
  const router = useRouter();

  // Extract language from URL
  const getLanguageFromPath = (path: string): string => {
    const pathParts = path.split('/').filter(Boolean);
    const firstPart = pathParts[0] || '';
    
    return supportedLanguages.includes(firstPart) ? firstPart : 'tr'; // Default to Turkish
  };

  // Get path without language prefix
  const getPathWithoutLanguage = (path: string): string => {
    const pathParts = path.split('/').filter(Boolean);
    const firstPart = pathParts[0] || '';
    
    if (supportedLanguages.includes(firstPart)) {
      return '/' + pathParts.slice(1).join('/');
    }
    
    return path;
  };

  // Add language prefix to a path
  const addLanguageToPath = (path: string, language: string): string => {
    if (path === '/' || path === '') {
      return `/${language}`;
    }
    
    const pathWithoutLanguage = getPathWithoutLanguage(path);
    return `/${language}${pathWithoutLanguage}`;
  };

  // Initialize - set language based on URL if present
  useEffect(() => {
    const detectedLanguage = getLanguageFromPath(location);
    
    // If URL doesn't have language prefix, redirect to default language
    if (!location.split('/').filter(Boolean)[0]) {
      const storedLanguage = localStorage.getItem('i18nextLng') || 'tr';
      setLocation(`/${storedLanguage}${location}`);
    } else if (detectedLanguage !== i18n.language) {
      // Sync i18n with URL language
      i18n.changeLanguage(detectedLanguage);
    }
  }, [location, i18n, setLocation]);
  
  // Language setter
  const setLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('i18nextLng', language);
    
    // Update URL to reflect language change
    const newPath = addLanguageToPath(location, language);
    setLocation(newPath);
  };
  
  // Function to get correct path with language prefix
  const translatePath = (path: string): string => {
    if (path.startsWith('/admin')) {
      // Don't add language prefix to admin routes
      return path;
    }
    return addLanguageToPath(path, i18n.language);
  };

  const value = {
    currentLanguage: i18n.language,
    setLanguage,
    translatePath,
  };

  return (
    <LanguageRouterContext.Provider value={value}>
      {children}
    </LanguageRouterContext.Provider>
  );
};

export const useLanguageRouter = (): LanguageRouterContextType => {
  const context = useContext(LanguageRouterContext);
  
  if (context === undefined) {
    throw new Error('useLanguageRouter must be used within a LanguageRouter');
  }
  
  return context;
};

// Custom Link component that adds language prefix to paths
interface LanguageLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const LanguageLink: React.FC<LanguageLinkProps> = ({ 
  href, 
  children, 
  className,
  onClick
}) => {
  const { translatePath } = useLanguageRouter();
  const translatedHref = translatePath(href);
  
  const [, navigate] = useLocation();
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
    navigate(translatedHref);
  };
  
  return (
    <a href={translatedHref} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};