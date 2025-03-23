import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BeforeAfter } from "@shared/schema";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export function BeforeAfterGallery() {
  const { data: items, isLoading } = useQuery<BeforeAfter[]>({
    queryKey: ["/api/before-after"],
  });

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Yükleniyor...</p>
      </div>
    );
  }

  if (!items?.length) {
    return null;
  }

  return (
    <div className="py-12">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-8"
      >
        Öncesi ve Sonrası Görüntüleri
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    {item.treatmentType}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Tedavi Tarihi: {format(new Date(item.treatmentDate), 'd MMMM yyyy', { locale: tr })}
                  </p>
                  {item.notes && (
                    <p className="mt-3 text-sm">{item.notes}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        Öncesi
                      </div>
                      {item.beforeImages?.[0] && (
                        <img 
                          src={item.beforeImages[0]} 
                          alt="Tedavi öncesi" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    {item.beforeDate && (
                      <p className="text-xs text-center text-muted-foreground">
                        {format(new Date(item.beforeDate), 'd MMMM yyyy', { locale: tr })}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <div className="absolute top-2 right-2 bg-primary/80 text-white text-xs px-2 py-1 rounded">
                        Sonrası
                      </div>
                      {item.afterImages?.[0] && (
                        <img 
                          src={item.afterImages[0]} 
                          alt="Tedavi sonrası" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    {item.afterDate && (
                      <p className="text-xs text-center text-muted-foreground">
                        {format(new Date(item.afterDate), 'd MMMM yyyy', { locale: tr })}
                      </p>
                    )}
                  </div>
                </div>

                {item.description && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm">{item.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}