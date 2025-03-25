import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { PlayCircle } from "lucide-react";

// Örnek veri - Gerçek verilerle değiştirilecek
const clinicContent = {
  images: [
    {
      id: 1,
      type: "image",
      url: "/images/clinic/reception.jpg",
      title: "Modern Resepsiyon",
      description: "Ferah ve modern resepsiyon alanımız"
    },
    {
      id: 2,
      type: "image",
      url: "/images/clinic/operation-room.jpg",
      title: "Operasyon Odası",
      description: "Son teknoloji operasyon odamız"
    },
    {
      id: 3,
      type: "video",
      url: "/videos/clinic-tour.mp4",
      thumbnail: "/images/clinic/tour-thumbnail.jpg",
      title: "Klinik Turu",
      description: "Kliniğimizin sanal turu"
    }
  ]
};

export function ClinicGallery() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const { t } = useTranslation('common');

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clinicContent.images.map((item) => (
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
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <PlayCircle className="w-16 h-16 text-white" />
                    </div>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {item.type === "video" ? "Video" : "Fotoğraf"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{item.description}</p>
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
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={selectedItem?.url}
                alt={selectedItem?.title}
                className="w-full rounded-lg"
              />
            )}
            <div className="mt-4">
              <h3 className="text-xl font-semibold mb-2">{selectedItem?.title}</h3>
              <p className="text-gray-600">{selectedItem?.description}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
