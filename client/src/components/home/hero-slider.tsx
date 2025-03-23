import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Slider } from "@shared/schema";

export default function HeroSlider() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const { data: sliders, isLoading } = useQuery<Slider[]>({
    queryKey: ["/api/sliders"],
  });

  const activeSliders = sliders?.filter(slider => slider.isActive === "true") || [];

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

    // Otomatik geçiş
    const autoplayInterval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      clearInterval(autoplayInterval);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (isLoading) {
    return <div className="h-[50vh] bg-muted animate-pulse" />;
  }

  if (!activeSliders.length) {
    return null;
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />

      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {activeSliders.map((slider) => (
            <div key={slider.id} className="embla__slide relative">
              <div className="relative h-[50vh] min-h-[400px] w-full">
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${slider.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center text-center text-white p-6">
                  <div className="max-w-2xl">
                    <h2 className="text-4xl font-bold mb-4">{slider.title}</h2>
                    {slider.description && (
                      <p className="text-lg mb-6">{slider.description}</p>
                    )}
                    {slider.buttonText && slider.buttonUrl && (
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="bg-white/10 hover:bg-white/20 border-white text-white"
                        onClick={() => window.location.href = slider.buttonUrl}
                      >
                        {slider.buttonText}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={scrollPrev}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
        onClick={scrollNext}
      >
        <ArrowRight className="h-4 w-4" />
      </Button>

      {/* Dots */}
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