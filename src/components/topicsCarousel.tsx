import { useDispatch, useSelector } from "react-redux";
import {
  // addPack,
  // removePack,
  addTopicToTopicPack,
  removeTopic,
  // renamePack,
  renameTopic,
  moveTopicUp,
  moveTopicDown,
  setActiveTopicPack,
} from "./../store/baseInfoStore";
import { useCallback, useRef, useState } from "react";
import { AnimatePresence, useReducedMotion, motion, type Variants } from "motion/react";
import type { Topic, TopicsPack } from "../store/baseInfoStore";

export interface CarouselSlide {
  id: string;
  label: string;
  topics: string[];
}

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

export default function Carousel() {
  // const [[index, direction], setIndexState] = useState<[number, number]>([0, 0]);
  // const [expanded, setExpanded] = useState(true); // Defaulted to open for demo
  const prefersReducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  // const packs = slides[index];

  // // Local state for inputs
  // const [inputValue, setInputValue] = useState("");
  // const [editingId, setEditingId] = useState<string | null>(null);
  // const [editValue, setEditValue] = useState("");

  const [expanded, setExpanded] = useState(true);

  const [inputValue, setInputValue] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);

  const [editValue, setEditValue] = useState("");

const [direction, setDirection] = useState(0);

const dispatch = useDispatch();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const preference = useSelector((state: any) => state.preference);

const packs = preference.topicsPack;

const index = packs.findIndex(
(p:TopicsPack) => p.label === preference.activeTopicPack
);
  const activePack =
    packs.find((i: TopicsPack) => i.label === preference.activeTopicPack) ??
    packs[0];

  const currentTopics: Topic[] = activePack?.topics ?? [];

  // const currentIndex = packs.findIndex(
  //   (i) => i.label === preference.activeTopicPack,
  // );

  const goTo = useCallback(
    (nextIndex: number) => {
       const wrapped = (nextIndex + packs.length) % packs.length;

  setDirection(wrapped > index ? 1 : -1);

  dispatch(setActiveTopicPack(packs[wrapped].label));

  if (!expanded) setExpanded(true);
  setEditingId(null);
    },
    [packs, expanded],
  );

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    dispatch(
      addTopicToTopicPack({
        targetPack: activePack.label,
        topic: {
          id: crypto.randomUUID(),
          topic: inputValue.trim(),
        },
      }),
    );

    setInputValue("");
  };

  const handleDelete = (id: string) => {
    dispatch(
      removeTopic({
        targetPack: activePack.label,
        topicId: id,
      }),
    );
  };

  const handleSaveEdit = (id: string) => {
    if (!editValue.trim()) return;

    dispatch(
      renameTopic({
        targetPack: activePack.label,
        topicId: id,
        topic: editValue.trim(),
      }),
    );

    setEditingId(null);
  };

  const moveUp = (index: number) => {
    dispatch(
      moveTopicUp({
        targetPack: activePack.label,
        index,
      }),
    );
  };

  const moveDown = (index: number) => {
    dispatch(
      moveTopicDown({
        targetPack: activePack.label,
        index,
      }),
    );
  };

  // const handleAddPack = (label: string) => {
  //   dispatch(
  //     addPack({
  //       label,
  //       topics: [],
  //     }),
  //   );

  //   dispatch(setActiveTopicPack(label));
  // };

  // const handleDeletePack = (label: string) => {
  //   dispatch(removePack(label));
  // };

  // const handleRenamePack = (oldLabel: string, newLabel: string) => {
  //   dispatch(
  //     renamePack({
  //       oldLabel,
  //       newLabel,
  //     }),
  //   );
  // };

  return (
    <div className="mx-auto w-full max-w-2xl bg-gray-50 p-4 sm:p-8 rounded-t-3xl sm:rounded-3xl shadow-sm border border-gray-100">
      {/* ── Tab bar ────────────────────────────────────────────────── */}
      <div
        ref={trackRef}
        role="tablist"
        aria-label="Topic Packs"
        tabIndex={0}
        className="flex flex-wrap items-center justify-between gap-2 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
      >
        {packs.map((pack:TopicsPack, i:number) => {
          const active = pack.label === preference.activeTopicPack;

          return (
            <button
              key={pack.label}
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
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 40,
                  }}
                />
              )}

              <span className={`relative z-20 ${active ? "font-bold" : ""}`}>
                {pack.label}
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
            initial={
              prefersReducedMotion ? undefined : { height: 0, opacity: 0 }
            }
            animate={{ height: "auto", opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-6 pb-2">
              <div className="relative min-h-[400px] overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] ring-1 ring-gray-100">
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  <motion.article
                    key={activePack.label}
                    custom={direction}
                    variants={
                      prefersReducedMotion ? undefined : contentVariants
                    }
                    initial={prefersReducedMotion ? undefined : "enter"}
                    animate="center"
                    exit={prefersReducedMotion ? undefined : "exit"}
                    className="flex h-full flex-col p-6 sm:p-8"
                  >
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                        {activePack.label} Sentences
                      </h2>
                    </div>

                    {/* Input Field */}
                    <form onSubmit={handleAddTopic} className="flex gap-3 mb-6">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Add a new Topic?..."
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
                          No topics added yet.{" "}
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
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="m18 15-6-6-6 6" />
                                </svg>
                              </button>
                              <button
                                onClick={() => moveDown(i)}
                                disabled={i === currentTopics.length - 1}
                                className="text-gray-300 hover:text-emerald-500 disabled:opacity-30 disabled:hover:text-gray-300 transition-colors"
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="m6 9 6 6 6-6" />
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
                                    if (e.key === "Enter")
                                      handleSaveEdit(topic.id);
                                    if (e.key === "Escape") setEditingId(null);
                                  }}
                                  className="w-full rounded-md border border-emerald-300 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                />
                              ) : (
                                <p className="text-sm font-medium text-gray-700 truncate whitespace-normal leading-relaxed">
                                  {topic.topic}
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
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M20 6 9 17l-5-5" />
                                  </svg>
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditingId(topic.id);
                                      setEditValue(topic.topic);
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                                  >
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M12 20h9" />
                                      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDelete(topic.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                  >
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M3 6h18" />
                                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                      <line x1="10" x2="10" y1="11" y2="17" />
                                      <line x1="14" x2="14" y1="11" y2="17" />
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
