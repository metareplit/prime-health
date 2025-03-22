import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

interface SuccessStory {
  id: number;
  name: string;
  age: string;
  location: string;
  procedure: string;
  testimonial: string;
  rating: number;
  imageUrl: string;
}

const successStories: SuccessStory[] = [
  {
    id: 1,
    name: "Ahmet Y.",
    age: "35",
    location: "İstanbul",
    procedure: "Saç Ekimi",
    testimonial: "Uzun süre saç dökülmesi problemi yaşadıktan sonra kliniğinizde saç ekimi yaptırdım. Sonuçlar beklediğimden çok daha iyi. Doğal ve sık bir saça kavuştum.",
    rating: 5,
    imageUrl: "/images/testimonials/ahmet.jpg"
  },
  {
    id: 2,
    name: "Mehmet S.",
    age: "42",
    location: "Ankara",
    procedure: "Sakal Ekimi",
    testimonial: "Sakal ekimi konusunda tereddütlerim vardı ancak operasyon sonrası aldığım sonuç muhteşem. Artık daha genç ve bakımlı görünüyorum.",
    rating: 5,
    imageUrl: "/images/testimonials/mehmet.jpg"
  },
  {
    id: 3,
    name: "Ali K.",
    age: "38",
    location: "İzmir",
    procedure: "Saç Ekimi",
    testimonial: "Profesyonel ekip ve modern teknolojiler sayesinde çok başarılı bir sonuç aldım. Özgüvenim yerine geldi.",
    rating: 5,
    imageUrl: "/images/testimonials/ali.jpg"
  }
];

export function SuccessStories() {
  return (
    <div className="py-12">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-center mb-8"
      >
        Hasta Başarı Hikayeleri
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {successStories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-12 h-12 border-2 border-primary/10">
                    <img src={story.imageUrl} alt={story.name} className="object-cover" />
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-base">{story.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {story.age} yaş, {story.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
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

                <div className="relative bg-muted/50 rounded-lg p-4 mb-4 flex-grow">
                  <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/20" />
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    {story.testimonial}
                  </p>
                </div>

                <div className="mt-auto">
                  <p className="text-sm font-medium text-primary">
                    {story.procedure}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}