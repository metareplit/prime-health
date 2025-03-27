import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface VideoItem {
  id: number;
  src: string;
  category: string;
  translationKey: string;
}

export const ClinicVideos = () => {
  const { t } = useTranslation('common');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  // Video items with their corresponding translation keys
  const videoItems: VideoItem[] = [
    {
      id: 1,
      src: "/videos/clinic/VID-20250325-WA0004.mp4",
      category: "operation",
      translationKey: "gallery.videos.operationProcess"
    },
    {
      id: 2,
      src: "/videos/clinic/VID-20250325-WA0005.mp4",
      category: "technique",
      translationKey: "gallery.videos.hairlineDesign"
    },
    {
      id: 3,
      src: "/videos/clinic/VID-20250325-WA0006.mp4",
      category: "procedure",
      translationKey: "gallery.videos.graftExtraction"
    },
    {
      id: 4,
      src: "/videos/clinic/VID-20250325-WA0007.mp4",
      category: "technique",
      translationKey: "gallery.videos.implantationProcess"
    },
    {
      id: 5,
      src: "/videos/clinic/VID-20250325-WA0008.mp4",
      category: "clinic",
      translationKey: "gallery.videos.clinicTour"
    },
    {
      id: 6,
      src: "/videos/clinic/VID-20250325-WA0009.mp4",
      category: "patient",
      translationKey: "gallery.videos.patientExperience"
    },
    {
      id: 7,
      src: "/videos/clinic/VID-20250325-WA0010.mp4",
      category: "team",
      translationKey: "gallery.videos.teamAtWork"
    },
    {
      id: 8,
      src: "/videos/clinic/VID-20250325-WA0011.mp4",
      category: "aftercare",
      translationKey: "gallery.videos.aftercareProcess"
    },
    {
      id: 9,
      src: "/videos/clinic/VID-20250325-WA0012.mp4",
      category: "technique",
      translationKey: "gallery.videos.dhiTechnique"
    },
    {
      id: 10,
      src: "/videos/clinic/VID-20250325-WA0013.mp4",
      category: "technique",
      translationKey: "gallery.videos.fueTechnique"
    },
    {
      id: 11,
      src: "/videos/clinic/VID-20250325-WA0014.mp4",
      category: "operation",
      translationKey: "gallery.videos.operationProcess"
    },
    {
      id: 12,
      src: "/videos/clinic/VID-20250325-WA0015.mp4",
      category: "technique",
      translationKey: "gallery.videos.hairlineDesign"
    },
    {
      id: 13,
      src: "/videos/clinic/VID-20250325-WA0016.mp4",
      category: "procedure",
      translationKey: "gallery.videos.graftExtraction"
    },
    {
      id: 14,
      src: "/videos/clinic/VID-20250325-WA0017.mp4",
      category: "technique",
      translationKey: "gallery.videos.implantationProcess"
    },
    {
      id: 15,
      src: "/videos/clinic/VID-20250325-WA0019.mp4",
      category: "clinic",
      translationKey: "gallery.videos.clinicTour"
    },
    {
      id: 16,
      src: "/videos/clinic/VID-20250325-WA0020.mp4",
      category: "patient",
      translationKey: "gallery.videos.patientExperience"
    },
    {
      id: 17,
      src: "/videos/clinic/VID-20250325-WA0031.mp4",
      category: "team",
      translationKey: "gallery.videos.teamAtWork"
    },
    {
      id: 18,
      src: "/videos/clinic/VID-20250325-WA0032.mp4",
      category: "aftercare",
      translationKey: "gallery.videos.aftercareProcess"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {t('gallery.videos.title')}
        </h2>
        <p className="text-gray-600">
          {t('gallery.videos.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoItems.map((video) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: video.id * 0.05 }}
          >
            <Card className="overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
              <CardHeader className="p-0 relative">
                <div className="aspect-video bg-gray-100 relative group cursor-pointer overflow-hidden" onClick={() => setSelectedVideo(video)}>
                  <video 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={video.src}
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-all duration-300">
                    <span className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center text-white">
                      <Play className="w-6 h-6 ml-1" />
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-grow flex flex-col">
                <CardTitle className="text-lg mb-1">
                  {t(`${video.translationKey}.title`)}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 flex-grow">
                  {t(`${video.translationKey}.description`)}
                </CardDescription>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 w-full"
                  onClick={() => setSelectedVideo(video)}
                >
                  {t('gallery.labels.video')}
                  <Play className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Video Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl w-[90vw]">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedVideo && t(`${selectedVideo.translationKey}.title`)}
            </DialogTitle>
            <DialogDescription>
              {selectedVideo && t(`${selectedVideo.translationKey}.description`)}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 aspect-video w-full bg-black rounded-md overflow-hidden">
            {selectedVideo && (
              <video
                src={selectedVideo.src}
                controls
                autoPlay
                className="w-full h-full"
              />
            )}
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" /> 
              {t('gallery.buttons.share')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};