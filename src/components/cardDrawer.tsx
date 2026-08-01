import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Zap, Moon } from 'lucide-react'; 

const CARD_DATA = [
  {
    id: 1,
    title: "Current Card",
    name: "Focus Mode",
    description: "High focus • Low distraction",
    icon: Brain,
    colorTheme: "emerald",
    svgColor: "#10b981"
  },
  {
    id: 2,
    title: "Alternative",
    name: "Energy Boost",
    description: "High energy • Fast paced",
    icon: Zap,
    colorTheme: "amber",
    svgColor: "#f59e0b"
  },
  {
    id: 3,
    title: "Rest",
    name: "Wind Down",
    description: "Relaxed • Minimal alerts",
    icon: Moon,
    colorTheme: "indigo",
    svgColor: "#6366f1"
  }
];

type cardType={
    id:number;
    title:string;
    name:string;
    description:string;
    icon:React.ComponentType<{size:number}>;
    colorTheme:string;
    svgColor:string;
}

// Assuming type definitions exist in your scope
export default function CardDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeCard, setActiveCard] = useState<cardType>(CARD_DATA[0]);

  const handleCardSelect = (card: cardType) => {
    setActiveCard(card);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Bottom Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-gray-50 rounded-t-3xl p-6 z-50 shadow-2xl"
          >
            {/* Drawer Drag Handle (Visual only) */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Select a Mode
            </h2>

            {/* MAPPED CARDS */}
            <div className="flex flex-col gap-4 pb-8">
              {CARD_DATA.map((card) => {
                const Icon = card.icon;
                const isActive = activeCard.id === card.id;

                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardSelect(card)}
                    className={`
                      ${
                        isActive
                          ? "ring-2 ring-emerald-500"
                          : "opacity-85 hover:opacity-100"
                      } 
                      bg-white rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] 
                      flex justify-between items-center cursor-pointer transition-all duration-200
                    `}
                  >
                    <div>
                      <h3 className="text-sm font-semibold mb-1 text-gray-700">
                        {card.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: card.svgColor }}
                        />
                        <span className="font-bold text-sm text-gray-900">
                          {card.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500">
                        {card.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Decorative Squiggle Line */}
                      <svg
                        width="60"
                        height="20"
                        viewBox="0 0 60 20"
                        fill="none"
                        className="opacity-40"
                      >
                        <path
                          d="M0 10 Q 15 20, 30 10 T 60 10"
                          stroke={card.svgColor}
                          strokeWidth="2"
                          fill="transparent"
                        />
                      </svg>

                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: `${card.svgColor}15`,
                          color: card.svgColor,
                        }}
                      >
                        <Icon size={20} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}