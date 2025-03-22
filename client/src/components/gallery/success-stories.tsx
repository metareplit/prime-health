import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, Quote, Play, Pause } from "lucide-react";

interface SuccessStory {
  id: number;
  name: string;
  age: string;
  location: string;
  procedure: string;
  testimonial: string;
  rating: number;
  videoUrl?: string;
  imageUrl: string;
}

const successStories: SuccessStory[] = [
  {
    id: 1,
    name: "Ahmet Y.",
    age: "35",
    location: "İstanbul",
    procedure: "Saç Ekimi",
    testimonial: "Harika sonuçlar aldım, çok memnunum...",
    rating: 5,
    videoUrl: "/videos/testimonial-1.mp4",
    imageUrl: "/images/testimonials/ahmet.jpg"
  },
  // Diğer başarı hikayeleri...
];

export function SuccessStories() {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Başarı Hikayeleri</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {successStories.map((story) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden">
              <div className="relative aspect-video bg-gray-100">
                {story.videoUrl ? (
                  <>
                    <video
                      src={story.videoUrl}
                      poster={story.imageUrl}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute bottom-4 right-4"
                      onClick={() => {
                        setActiveVideo(activeVideo === story.id ? null : story.id);
                        setIsPlaying(!isPlaying);
                      }}
                    >
                      {activeVideo === story.id && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </>
                ) : (
                  <img
                    src={story.imageUrl}
                    alt={story.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <img src={story.imageUrl} alt={story.name} />
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{story.name}</h3>
                    <p className="text-sm text-gray-500">
                      {story.age} yaş, {story.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < story.rating ? "text-yellow-400" : "text-gray-200"
                      }`}
                      fill={i < story.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>

                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-4 w-4 text-primary/20" />
                  <p className="text-sm text-gray-600 italic pl-6">
                    {story.testimonial}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">{story.procedure}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}