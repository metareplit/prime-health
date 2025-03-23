import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SuccessStory } from "@shared/schema";
import { useTranslation } from "react-i18next";

export function SuccessStories() {
  const { t } = useTranslation('common');
  const { data: stories, isLoading } = useQuery<SuccessStory[]>({
    queryKey: ["/api/success-stories"],
  });

  const publishedStories = stories?.filter(story => story.published) || [];
  const featuredStories = publishedStories.filter(story => story.featured);
  const regularStories = publishedStories.filter(story => !story.featured);
  const allStories = [...featuredStories, ...regularStories];

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">{t('ui.table.loading')}</p>
      </div>
    );
  }

  if (!allStories.length) {
    return null;
  }

  return (
    <div className="py-12">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-center mb-8"
      >
        {t('gallery.testimonial.title')}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allStories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-4">
                  {story.beforeImages?.[0] && (
                    <Avatar className="w-12 h-12 border-2 border-primary/10">
                      <img 
                        src={story.beforeImages[0]} 
                        alt={`${story.patientName} ${t('gallery.patientDetails.before')}`}
                        className="object-cover" 
                      />
                    </Avatar>
                  )}
                  <div>
                    <h3 className="font-medium text-base flex items-center gap-2">
                      {story.patientName}
                      {story.featured && (
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {story.age} {t('gallery.patientDetails.age')}
                    </p>
                  </div>
                </div>

                {story.satisfaction && (
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < story.satisfaction! ? "text-yellow-400" : "text-gray-200"
                        }`}
                        fill={i < story.satisfaction! ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                )}

                <div className="relative bg-muted/50 rounded-lg p-4 mb-4 flex-grow">
                  <Quote className="absolute -top-2 -left-2 h-6 w-6 text-primary/20" />
                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    {story.testimonial || story.description}
                  </p>
                </div>

                {(story.beforeImages?.length > 0 || story.afterImages?.length > 0) && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {story.beforeImages?.[0] && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">{t('gallery.patientDetails.before')}</p>
                        <img 
                          src={story.beforeImages[0]} 
                          alt={t('gallery.patientDetails.before')}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    {story.afterImages?.[0] && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">{t('gallery.patientDetails.after')}</p>
                        <img 
                          src={story.afterImages[0]} 
                          alt={t('gallery.patientDetails.after')}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4">
                  <p className="text-sm font-medium text-primary">
                    {story.treatmentType}
                  </p>
                  {story.recoveryTime && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('gallery.procedureDetails.recoveryTime')}: {story.recoveryTime}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}