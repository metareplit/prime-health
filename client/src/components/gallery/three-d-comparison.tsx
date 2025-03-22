import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ThreeDComparisonProps {
  beforeImage: string;
  afterImage: string;
}

export default function ThreeDComparison({ beforeImage, afterImage }: ThreeDComparisonProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setRotation(prev => ({
          x: prev.x,
          y: (prev.y + 1) % 360
        }));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  return (
    <div 
      className="w-full h-[400px] rounded-lg overflow-hidden relative perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={(e) => {
        if (isHovered) {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
          const y = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
          setRotation({ x, y });
        }
      }}
    >
      <motion.div
        className="absolute inset-0 preserve-3d"
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
          transition: { type: "spring", stiffness: 100, damping: 30 }
        }}
      >
        {/* Before Image Side */}
        <div 
          className="absolute inset-0 backface-hidden"
          style={{
            backgroundImage: `url(${beforeImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            Öncesi
          </div>
        </div>

        {/* After Image Side */}
        <div 
          className="absolute inset-0 backface-hidden rotate-y-180"
          style={{
            backgroundImage: `url(${afterImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            Sonrası
          </div>
        </div>
      </motion.div>

      {/* Interactive Instructions */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0 : 0.8 }}
          className="bg-black/50 text-white px-4 py-2 rounded-full text-sm"
        >
          Fare ile etkileşime geçin
        </motion.div>
      </div>
    </div>
  );
}