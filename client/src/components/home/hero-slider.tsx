import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

const slides = [
  {
    image: "/images/slider/medical-tech.png",
    titleKey: "slider.title1",
    descriptionKey: "slider.description1",
    buttonTextKey: "slider.button1"
  },
  {
    image: "/images/slider/expert-team.png",
    titleKey: "slider.title2",
    descriptionKey: "slider.description2",
    buttonTextKey: "slider.button2"
  },
  {
    image: "/images/slider/professional-care.png",
    titleKey: "slider.title3",
    descriptionKey: "slider.description3",
    buttonTextKey: "slider.button3"
  },
  {
    image: "/images/slider/modern-clinic.png", // Updated image path
    titleKey: "slider.title4",
    descriptionKey: "slider.description4",
    buttonTextKey: "slider.button4"
  }
];

export default function HeroSlider() {
  const { t } = useTranslation('common');
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);

    const autoplayInterval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      clearInterval(autoplayInterval);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative overflow-hidden group">
      <div className="embla" ref={emblaRef}>
        <div className="embla__container h-[600px] md:h-[700px]">
          {slides.map((slide, index) => (
            <div key={index} className="embla__slide relative w-full flex-[0_0_100%]">
              <img 
                src={slide.image}
                alt={t(slide.titleKey)}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center text-white px-4"
                >
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg">
                    {t(slide.titleKey)}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-shadow">
                    {t(slide.descriptionKey)}
                  </p>
                  <Button 
                    size="lg" 
                    className="group relative overflow-hidden px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    asChild
                  >
                    <Link href="/randevu">
                      <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-lg">{t(slide.buttonTextKey)}</span>
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 hover:bg-white/20 border-white text-white"
        onClick={scrollPrev}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 hover:bg-white/20 border-white text-white"
        onClick={scrollNext}
      >
        <ArrowRight className="h-4 w-4" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === selectedIndex ? 'bg-white w-4' : 'bg-white/50'
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}