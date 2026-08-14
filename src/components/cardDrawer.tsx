import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CARD_DATA, type CardData } from "../lib/cards";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCard } from "../store/baseInfoStore";
import toast from "react-hot-toast";
import { ToastContainer } from "react-toastify";

type cardType = {
  id: number;
  title: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size: number }>;
  colorTheme: string;
  svgColor: string;
};

// Assuming type definitions exist in your scope
export default function CardDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const dispatch = useDispatch();
  const topics = useMemo(() => {
    const card: CardData | undefined = CARD_DATA.find(
      (i) => i.id == expandedCard,
    );
    return card?.topics ?? null;
  }, [expandedCard]);

  const currentCard = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.preference.cards.selectedCardId,
  );

  const handleCardSelect = async (card: cardType) => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.id) {
        toast.error("No active tab found");
        return;
      }

      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "REBOOT_CURRENT_SITE",
      });

      if (response?.status !== "success") {
        toast.error(response?.message || "Failed to update the current site");
        return;
      }

      dispatch(setSelectedCard(card.name));

      toast.success("Preference updated successfully");

      onClose();
    } catch (error) {
      console.error(error);
      toast.error(
        "Couldn't update this site. Make sure you're on a supported page.",
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <ToastContainer />
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
                const isActive = currentCard === card.name;
                const isExpanded = expandedCard === card.id;

                return (
                  <motion.div
                    key={card.id}
                    layout
                    onClick={() => handleCardSelect(card)}
                    className={`
        ${isActive ? "ring-2 ring-emerald-500" : "opacity-85 hover:opacity-100"}
        bg-white rounded-2xl p-4
        shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]
        cursor-pointer transition-all duration-200
      `}
                  >
                    {/* ========================================================= */}
                    {/* MAIN CARD CONTENT — stays horizontal */}
                    {/* ========================================================= */}

                    <div className="flex justify-between items-center">
                      {/* Left side */}
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

                      {/* ===================================================== */}
                      {/* Right side */}
                      {/* ===================================================== */}

                      <div className="flex items-end gap-2">
                        {/* Decorative Squiggle */}
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

                        <div className="flex flex-col items-center gap-2">
                          {/* Icon */}
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor: `${card.svgColor}15`,
                              color: card.svgColor,
                            }}
                          >
                            <Icon size={20} />
                          </div>

                          {/* Dropdown Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();

                              setExpandedCard((prev) =>
                                prev === card.id ? null : card.id,
                              );
                            }}
                            className={`
                rounded-full p-1.5
                transition-all duration-200
                ${
                  isExpanded
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                }
              `}
                          >
                            <motion.svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              animate={{
                                rotate: isExpanded ? 180 : 0,
                              }}
                              transition={{
                                duration: 0.25,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                            >
                              <path
                                d="m6 9 6 6 6-6"
                                stroke="currentColor"
                                strokeWidth="2.3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </motion.svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ========================================================= */}
                    {/* TOPICS DROPDOWN — vertical */}
                    {/* ========================================================= */}

                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{
                            height: 0,
                            opacity: 0,
                            y: -6,
                          }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                            y: 0,
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                            y: -6,
                          }}
                          transition={{
                            duration: 0.28,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            {/* Dropdown Header */}
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-1.5 h-1.5 rounded-full"
                                  style={{
                                    backgroundColor: card.svgColor,
                                  }}
                                />

                                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                  Topics
                                </span>
                              </div>

                              <span className="text-[10px] font-semibold text-gray-400">
                                {card.topics.length}{" "}
                                {card.topics.length === 1 ? "topic" : "topics"}
                              </span>
                            </div>

                            {/* Topics */}
                            {expandedCard == card.id && (
                              <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={{
                                  hidden: {},
                                  visible: {
                                    transition: {
                                      staggerChildren: 0.045,
                                    },
                                  },
                                }}
                                className="flex flex-col gap-2"
                              >
                                {topics &&
                                  card.topics.map((topic, index) => (
                                    <motion.div
                                      key={index}
                                      variants={{
                                        hidden: {
                                          opacity: 0,
                                          x: -8,
                                        },
                                        visible: {
                                          opacity: 1,
                                          x: 0,
                                        },
                                      }}
                                      transition={{
                                        duration: 0.2,
                                        ease: [0.22, 1, 0.36, 1],
                                      }}
                                      className="
                      group relative
                      flex items-center gap-3
                      rounded-xl
                      border border-gray-100
                      bg-gray-50/70
                      px-3.5 py-2.5
                      transition-all duration-200
                      hover:bg-white
                      hover:border-emerald-200
                      hover:shadow-[0_4px_14px_-6px_rgba(16,185,129,0.25)]
                    "
                                    >
                                      {/* Topic indicator */}
                                      <div
                                        className="flex-shrink-0 w-1.5 h-1.5 rounded-full transition-transform duration-200 group-hover:scale-125"
                                        style={{
                                          backgroundColor: card.svgColor,
                                        }}
                                      />

                                      {/* Topic text */}
                                      <span className="text-xs font-medium leading-relaxed text-gray-600 group-hover:text-gray-800">
                                        {topic}
                                      </span>
                                    </motion.div>
                                  ))}
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
