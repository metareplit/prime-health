import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import {
  Users,
  Microscope,
  Heart,
  Timer,
  Shield,
  UserPlus,
  Building2,
  MapPin
} from "lucide-react";

export default function Features() {
  const { t } = useTranslation('common');

  const features = [
    { icon: Users, key: 'expertise' },
    { icon: Microscope, key: 'technology' },
    { icon: Heart, key: 'care' },
    { icon: Timer, key: 'recovery' },
    { icon: Shield, key: 'guarantee' },
    { icon: UserPlus, key: 'approach' },
    { icon: Building2, key: 'clinic' },
    { icon: MapPin, key: 'location' }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-background/80">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t('home.features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('home.features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur border-primary/10">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
                    {t(`home.features.${feature.key}.title`)}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t(`home.features.${feature.key}.description`)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
