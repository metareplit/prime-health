import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BeforeAfter } from "@shared/schema";

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
        className="text-2xl font-bold text-center mb-8"
      >
        Öncesi ve Sonrası
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {item.beforeImages?.[0] && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Öncesi</p>
                      <img 
                        src={item.beforeImages[0]} 
                        alt="Tedavi öncesi" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  {item.afterImages?.[0] && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">Sonrası</p>
                      <img 
                        src={item.afterImages[0]} 
                        alt="Tedavi sonrası" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-primary">
                    {item.treatmentType}
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