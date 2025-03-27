import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { PlayCircle } from "lucide-react";

// Klinik görsel verileri ID'leri - veritabanından gelecek şekilde yapılandırıldı
type ClinicImage = {
  id: number;
  type: string;
  url: string;
  thumbnail?: string;
  titleKey: string;
  descriptionKey: string;
};

const clinicImages: ClinicImage[] = [
  {
    id: 1,
    type: "image",
    url: "/images/clinic/IMG-20250325-WA0046.jpg",
    titleKey: "gallery.clinic.hairTransplantProcedure.title",
    descriptionKey: "gallery.clinic.hairTransplantProcedure.description"
  },
  {
    id: 2,
    type: "image",
    url: "/images/clinic/IMG-20250325-WA0047.jpg",
    titleKey: "gallery.clinic.operationMoment.title",
    descriptionKey: "gallery.clinic.operationMoment.description"
  },
  {
    id: 3,
    type: "image",
    url: "/images/clinic/IMG-20250325-WA0048.jpg",
    titleKey: "gallery.clinic.clinicWork.title",
    descriptionKey: "gallery.clinic.clinicWork.description"
  },
  {
    id: 4,
    type: "image",
    url: "/images/clinic/IMG-20250325-WA0049.jpg",
    titleKey: "gallery.clinic.hairTransplantTechniques.title",
    descriptionKey: "gallery.clinic.hairTransplantTechniques.description"
  },
  {
    id: 5,
    type: "image",
    url: "/images/clinic/IMG-20250325-WA0050.jpg",
    titleKey: "gallery.clinic.operatingRoom.title",
    descriptionKey: "gallery.clinic.operatingRoom.description"
  },
  {
    id: 6,
    type: "image",
    url: "/images/clinic/IMG-20250325-WA0051.jpg",
    titleKey: "gallery.clinic.teamWork.title",
    descriptionKey: "gallery.clinic.teamWork.description"
  },
  {
    id: 7,
    type: "image",
    url: "/images/clinic/IMG-20250325-WA0053.jpg",
    titleKey: "gallery.clinic.expertDoctors.title",
    descriptionKey: "gallery.clinic.expertDoctors.description"
  },
  {
    id: 8,
    type: "image",
    url: "/images/clinic/IMG-20250325-WA0054.jpg",
    titleKey: "gallery.clinic.hairlineDesign.title",
    descriptionKey: "gallery.clinic.hairlineDesign.description"
  },
  {
    id: 9,
    type: "image",
    url: "/images/clinic/IMG-20250325-WA0055.jpg",
    titleKey: "gallery.clinic.operationDetails.title",
    descriptionKey: "gallery.clinic.operationDetails.description"
  },
  {
    id: 10,
    type: "image",
    url: "/images/clinic/IMG-20250325-WA0056.jpg",
    titleKey: "gallery.clinic.microFUETechnique.title",
    descriptionKey: "gallery.clinic.microFUETechnique.description"
  },
  {
    id: 11,
    type: "image",
    url: "/images/clinic/IMG-20250325-WA0057.jpg",
    titleKey: "gallery.clinic.surgicalMagnification.title",
    descriptionKey: "gallery.clinic.surgicalMagnification.description"
  },
  {
    id: 12,
    type: "image",
    url: "/images/clinic/IMG-20250325-WA0066.jpg",
    titleKey: "gallery.clinic.operationPreparation.title",
    descriptionKey: "gallery.clinic.operationPreparation.description"
  }
];

export function ClinicGallery() {
  const [selectedItem, setSelectedItem] = useState<ClinicImage | null>(null);
  const { t } = useTranslation('common');

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clinicImages.map((item) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="group cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <div className="relative overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative aspect-[4/3]">
                {item.type === "video" ? (
                  <div className="relative">
                    <img
                      src={item.thumbnail}
                      alt={t(item.titleKey)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <PlayCircle className="w-16 h-16 text-white" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={t(item.titleKey)}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{t(item.titleKey)}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {item.type === "video" ? t('gallery.labels.video') : t('gallery.labels.photo')}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{t(item.descriptionKey)}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl">
          <div className="p-4">
            {selectedItem?.type === "video" ? (
              <video
                controls
                className="w-full rounded-lg"
                src={selectedItem.url}
                poster={selectedItem.thumbnail}
              >
                {t('gallery.labels.videoNotSupported')}
              </video>
            ) : (
              <img
                src={selectedItem?.url}
                alt={selectedItem ? t(selectedItem.titleKey) : ''}
                className="w-full rounded-lg"
              />
            )}
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">
                {selectedItem ? t(selectedItem.titleKey) : ''}
              </h3>
              <p className="text-gray-600">
                {selectedItem ? t(selectedItem.descriptionKey) : ''}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
