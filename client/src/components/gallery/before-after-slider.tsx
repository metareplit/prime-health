import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({ 
  beforeImage, 
  afterImage, 
  beforeLabel = "Öncesi",
  afterLabel = "Sonrası"
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
    <motion.div
      ref={containerRef}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-lg touch-none select-none bg-gray-100 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Before Image */}
      <div className="absolute inset-0 bg-gray-200">
        <motion.img
          src={beforeImage}
          alt="Öncesi"
          className="w-full h-full object-cover"
          loading="lazy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* After Image */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <motion.img
          src={afterImage}
          alt="Sonrası"
          className="w-full h-full object-cover"
          loading="lazy"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </div>

      {/* Slider */}
      <motion.div
        className="absolute top-0 bottom-0 w-0.5 bg-white cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 1.1 }}
      >
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
          animate={{ 
            boxShadow: isHovered ? "0 0 15px rgba(255,255,255,0.8)" : "0 0 5px rgba(0,0,0,0.2)",
            scale: isDragging ? 1.2 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-0.5">
            <div className="w-0.5 h-3 bg-primary rounded-full transform -rotate-12" />
            <div className="w-0.5 h-3 bg-primary rounded-full transform rotate-12" />
          </div>
        </motion.div>
      </motion.div>

      {/* Labels */}
      <AnimatePresence>
        {isHovered && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs font-medium"
            >
              {beforeLabel}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs font-medium"
            >
              {afterLabel}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200/50 backdrop-blur-sm">
        <motion.div
          className="h-full bg-white"
          style={{ width: `${sliderPosition}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
    </motion.div>
  );
}