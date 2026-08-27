import { useState, useRef, useCallback } from "react";
import { Hand, Grab } from "lucide-react";
import beforeImg from "/ext.png";
import afterImg from "/ext2.png";

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none rounded-2xl shadow-2xl h-[720px] transition-colors ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchEnd={() => setIsDragging(false)}
    >
      {/* After Image (Dictates the natural height of the container) */}
      <img 
        src={afterImg} 
        alt="After" 
        className="block w-full h-fit pointer-events-none"
        draggable={false}
      />

      {/* Before Image (Overlaid and clipped dynamically) */}
      <img 
        src={beforeImg} 
        alt="Before" 
        className="absolute inset-0 w-full h-fit object-cover filter grayscale pointer-events-none"
        draggable={false}
        style={{
          // clipPath creates a perfect bounding box that reveals the image underneath
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          // This adds the "resistance" / heavy drag feel
          transition: isDragging ? 'clip-path 75ms ease-out' : 'clip-path 300ms ease-out',
        }}
      />

      {/* Draggable Divider Line & Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 flex items-center justify-center"
        style={{ 
          left: `${sliderPosition}%`,
          transition: isDragging ? 'left 75ms ease-out' : 'left 300ms ease-out',
        }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        onTouchMove={handleTouchMove}
      >
        {/* Palm Icon Handle Container */}
        <div 
          className={`absolute w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center transition-all duration-200 ${
            isDragging 
              ? "scale-90 shadow-sm ring-4 ring-blue-500/20" 
              : "hover:scale-110 hover:shadow-2xl ring-4 ring-white/50"
          }`}
        >
          {isDragging ? (
            <Grab className="w-5 h-5 text-blue-600" />
          ) : (
            <Hand className="w-5 h-5 text-slate-600" />
          )}
        </div>
      </div>
    </div>
  );
}