import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
}

export default function BeforeAfterSlider({ beforeImage, afterImage }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInteractionStart = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(x, 0), 100));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleTouchStart = () => setIsTouching(true);
  const handleTouchEnd = () => setIsTouching(false);

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleInteractionStart(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isTouching || !e.touches[0]) return;
    handleInteractionStart(e.touches[0].clientX);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, isTouching]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-lg touch-none select-none bg-gray-100"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Before Image */}
      <div className="absolute inset-0 bg-gray-200">
        <img
          src={beforeImage}
          alt="Öncesi"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* After Image */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={afterImage}
          alt="Sonrası"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Slider */}
      <motion.div
        className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 1.1 }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
          <div className="flex items-center gap-0.5">
            <div className="w-0.5 h-3 bg-primary rounded-full transform -rotate-12" />
            <div className="w-0.5 h-3 bg-primary rounded-full transform rotate-12" />
          </div>
        </div>
      </motion.div>

      {/* Labels */}
      <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs font-medium">
        Öncesi
      </div>
      <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs font-medium">
        Sonrası
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200/50 backdrop-blur-sm">
        <motion.div
          className="h-full bg-white"
          style={{ width: `${sliderPosition}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
}