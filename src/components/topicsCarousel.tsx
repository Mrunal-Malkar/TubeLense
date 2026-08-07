"use client";

import { useCallback, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { useSelector } from "react-redux";

export interface CarouselSlide {
  id: string;
  label: string;
  initialTopics: string[];
}

const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    id: "clarity",
    label: "Clarity",
    initialTopics: [
      "Most drafts fail because they try to say four things at once.",
      "Pick the single claim the reader must leave with.",
      "Cut every sentence that doesn't serve it.",
      "Clarity is not simplicity — it's the discipline of subtraction.",
    ],
  },
  {
    id: "restraint",
    label: "Restraint",
    initialTopics: [
      "Spend your boldness once per page.",
      "A page with one loud idea reads as confident.",
      "Decide where the risk lives and keep the rest quiet.",
    ],
  },
  {
    id: "rhythm",
    label: "Rhythm",
    initialTopics: [
      "Let structure carry meaning.",
      "Numbering and spacing are claims about how content relates.",
      "Only sequence things that are actually sequential.",
    ],
  },
];

const contentVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 24 : -24,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -16 : 16,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  }),
};

// Helper for unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function Carousel({
  slides = DEFAULT_SLIDES,
}: {
  slides?: CarouselSlide[];
}) {
  const [[index, direction], setIndexState] = useState<[number, number]>([0, 0]);
  const [expanded, setExpanded] = useState(true); // Defaulted to open for demo
  const prefersReducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  // Initialize state for the editable topics, keyed by slide ID
  const [topicsMap, setTopicsMap] = useState<Record<string, { id: string; text: string }[]>>(() => {
    const initialMap: Record<string, { id: string; text: string }[]> = {};
    slides.forEach((s) => {
      initialMap[s.id] = s.initialTopics.map((text) => ({ id: generateId(), text }));
    });
    return initialMap;
  });

  const slide = slides[index];
  const currentTopics = topicsMap[slide.id] || [];

  // Local state for inputs
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const goTo = useCallback(
    (nextIndex: number) => {
      const wrapped = (nextIndex + slides.length) % slides.length;
      setIndexState(([current]) => [
        wrapped,
        wrapped === current ? 0 : wrapped > current ? 1 : -1,
      ]);
      if (!expanded) setExpanded(true);
      setEditingId(null); // Close any open edit fields on tab switch
    },
    [slides.length, expanded]
  );

  // --- Topic Management Handlers ---

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setTopicsMap((prev) => ({
      ...prev,
      [slide.id]: [...prev[slide.id], { id: generateId(), text: inputValue.trim() }],
    }));
    setInputValue("");
  };

  const handleDelete = (id: string) => {
    setTopicsMap((prev) => ({
      ...prev,
      [slide.id]: prev[slide.id].filter((t) => t.id !== id),
    }));
  };

  const handleSaveEdit = (id: string) => {
    if (!editValue.trim()) return;
    setTopicsMap((prev) => ({
      ...prev,
      [slide.id]: prev[slide.id].map((t) =>
        t.id === id ? { ...t, text: editValue.trim() } : t
      ),
    }));
    setEditingId(null);
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setTopicsMap((prev) => {
      const newArr = [...prev[slide.id]];
      [newArr[idx - 1], newArr[idx]] = [newArr[idx], newArr[idx - 1]];
      return { ...prev, [slide.id]: newArr };
    });
  };

  const moveDown = (idx: number) => {
    if (idx === currentTopics.length - 1) return;
    setTopicsMap((prev) => {
      const newArr = [...prev[slide.id]];
      [newArr[idx + 1], newArr[idx]] = [newArr[idx], newArr[idx + 1]];
      return { ...prev, [slide.id]: newArr };
    });
  };

  return (
    <div className="mx-auto w-full max-w-2xl bg-gray-50 p-4 sm:p-8 rounded-t-3xl sm:rounded-3xl shadow-sm border border-gray-100">
      {/* ── Tab bar ────────────────────────────────────────────────── */}
      <div
        ref={trackRef}
        role="tablist"
        aria-label="Carousel sections"
        tabIndex={0}
        className="flex flex-wrap items-center justify-between gap-2 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
      >
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={active}
              onClick={() => goTo(i)}
              className={`
                relative flex-1 min-w-[80px] rounded-2xl px-3.5 py-2.5 text-center text-sm transition-all duration-200 z-10
                ${
                  active
                    ? "text-gray-900"
                    : "text-gray-500 font-medium opacity-85 hover:opacity-100 hover:bg-gray-200/50"
                }
              `}
            >
              {active && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-2xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-2 ring-emerald-500"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <span className={`relative z-20 ${active ? "font-bold" : ""}`}>
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Centered "Topics" Toggle Button ────────────────────────── */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2 text-sm font-bold text-gray-700 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-gray-100 transition-all hover:ring-2 hover:ring-emerald-500"
        >
          Topics
          <motion.svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            className="text-emerald-600"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <path
              d="M4 6.5 8 10l4-3.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </button>
      </div>

      {/* ── Collapsible Content Region ─────────────────────────────── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id="carousel-panel"
            key="panel"
            initial={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-6 pb-2">
              <div className="relative min-h-[400px] overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-gray-100">
                
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  <motion.article
                    key={slide.id}
                    custom={direction}
                    variants={prefersReducedMotion ? undefined : contentVariants}
                    initial={prefersReducedMotion ? undefined : "enter"}
                    animate="center"
                    exit={prefersReducedMotion ? undefined : "exit"}
                    className="flex h-full flex-col p-6 sm:p-8"
                  >
                    
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                        {slide.label} Sentences
                      </h2>
                    </div>

                    {/* Input Field */}
                    <form onSubmit={handleAddTopic} className="flex gap-3 mb-6">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Add a new sentence..."
                        className="flex-1 rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Add
                      </button>
                    </form>

                    {/* Draggable/Editable List Area */}
                    <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1 pb-4">
                      {currentTopics.length === 0 ? (
                        <p className="text-center text-sm text-gray-400 py-8">
                          No sentences added yet.
                        </p>
                      ) : (
                        currentTopics.map((topic, i) => (
                          <div
                            key={topic.id}
                            className="group flex items-center gap-3 p-3.5 bg-white border border-gray-100 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-emerald-200 transition-all"
                          >
                            {/* Up / Down Controls */}
                            <div className="flex flex-col gap-1 items-center justify-center">
                              <button
                                onClick={() => moveUp(i)}
                                disabled={i === 0}
                                className="text-gray-300 hover:text-emerald-500 disabled:opacity-30 disabled:hover:text-gray-300 transition-colors"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="m18 15-6-6-6 6"/>
                                </svg>
                              </button>
                              <button
                                onClick={() => moveDown(i)}
                                disabled={i === currentTopics.length - 1}
                                className="text-gray-300 hover:text-emerald-500 disabled:opacity-30 disabled:hover:text-gray-300 transition-colors"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="m6 9 6 6 6-6"/>
                                </svg>
                              </button>
                            </div>

                            {/* Text / Edit Mode */}
                            <div className="flex-1 min-w-0">
                              {editingId === topic.id ? (
                                <input
                                  autoFocus
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveEdit(topic.id);
                                    if (e.key === 'Escape') setEditingId(null);
                                  }}
                                  className="w-full rounded-md border border-emerald-300 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                />
                              ) : (
                                <p className="text-sm font-medium text-gray-700 truncate whitespace-normal leading-relaxed">
                                  {topic.text}
                                </p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                              {editingId === topic.id ? (
                                <button
                                  onClick={() => handleSaveEdit(topic.id)}
                                  className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6 9 17l-5-5"/>
                                  </svg>
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingId(topic.id);
                                      setEditValue(topic.text);
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(topic.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                  >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
                                    </svg>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </motion.article>
                </AnimatePresence>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}