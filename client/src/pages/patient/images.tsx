import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Image as ImageIcon, Upload, Eye } from "lucide-react";
import type { PatientImage } from "@shared/schema";
import { Metadata } from "@/components/ui/metadata";
import { useTranslation } from "react-i18next";

export default function PatientImages() {
  const { t } = useTranslation('common');

  const { data: images } = useQuery<PatientImage[]>({
    queryKey: ["/api/patient-images"],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Metadata 
        title={t('patient.images.title')}
        description={t('patient.images.description')}
        keywords="hasta görselleri, tedavi takip, saç ekimi öncesi sonrası, hasta portal görseller"
        type="website"
      />

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t('patient.images.title')}</h1>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            {t('patient.images.uploadNew')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images?.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>{t('patient.images.noImages')}</p>
              <p className="text-sm mt-2">
                {t('patient.images.uploadPrompt')}
              </p>
            </div>
          )}

          {images?.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={image.imageUrl}
                  alt={`${image.type} tedavi görseli - ${new Date(image.date).toLocaleDateString()}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="secondary">
                    <Eye className="h-4 w-4 mr-2" />
                    {t('patient.images.view')}
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium capitalize">{image.type}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(image.date).toLocaleDateString()}
                    </p>
                  </div>
                  {image.doctorFeedback && (
                    <div className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded">
                      {t('patient.images.doctorFeedback')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}