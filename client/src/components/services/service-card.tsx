import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Service } from "@shared/schema";
import { useTranslation } from "react-i18next";
import { useCallback } from "react";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const { t, i18n } = useTranslation('common');
  const currentLang = i18n.language;
  
  // Get the localized service name and description based on current language
  const getLocalizedServiceName = useCallback(() => {
    if (currentLang === 'tr') return service.name;
    if (currentLang === 'en' && t(`services.serviceItems.${service.id}.name`)) 
      return t(`services.serviceItems.${service.id}.name`);
    if (currentLang === 'ru' && t(`services.serviceItems.${service.id}.name`)) 
      return t(`services.serviceItems.${service.id}.name`);
    if (currentLang === 'ka' && t(`services.serviceItems.${service.id}.name`)) 
      return t(`services.serviceItems.${service.id}.name`);
    return service.name;
  }, [service.id, service.name, currentLang, t]);

  const getLocalizedServiceDescription = useCallback(() => {
    if (currentLang === 'tr') return service.description;
    if (currentLang === 'en' && t(`services.serviceItems.${service.id}.description`)) 
      return t(`services.serviceItems.${service.id}.description`);
    if (currentLang === 'ru' && t(`services.serviceItems.${service.id}.description`)) 
      return t(`services.serviceItems.${service.id}.description`);
    if (currentLang === 'ka' && t(`services.serviceItems.${service.id}.description`)) 
      return t(`services.serviceItems.${service.id}.description`);
    return service.description;
  }, [service.id, service.description, currentLang, t]);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{getLocalizedServiceName()}</CardTitle>
        <CardDescription>{getLocalizedServiceDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <img
          src={service.imageUrl}
          alt={getLocalizedServiceName()}
          className="w-full h-48 object-cover rounded-md mb-4"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/images/services/primehealth1.png";
          }}
        />
        <Link href={`/randevu?service=${service.slug}`}>
          <Button className="w-full">{t('services.consultation.button')}</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
