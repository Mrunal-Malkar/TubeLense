import { useDispatch, useSelector } from "react-redux";
import {
  addPack,
  removePack,
  addTopicToTopicPack,
  removeTopic,
  renamePack,
  renameTopic,
  moveTopicUp,
  moveTopicDown,
  setActiveTopicPack,
  resetPackTopics,
} from "./../store/baseInfoStore";
import { CARD_DATA } from "../lib/cards";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  useReducedMotion,
  motion,
  type Variants,
} from "motion/react";
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
  const [newPackLabel, setNewPackLabel] = useState("");
  const [isRenamingPack, setIsRenamingPack] = useState(false);
  const [renamePackValue, setRenamePackValue] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [direction, setDirection] = useState(0);

  const dispatch = useDispatch();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const preference = useSelector((state: any) => state.preference);

  const packs = preference.topicsPack;

  const index = packs.findIndex(
    (p: TopicsPack) => p.label === preference.activeTopicPack,
  );
  const activePack =
    packs.find((i: TopicsPack) => i.label === preference.activeTopicPack) ??
    packs[0];

  const isCardPack = CARD_DATA.some(
    (card) => card.name === activePack?.label,
  );

  const currentTopics: Topic[] = activePack?.topics ?? [];

  useEffect(() => {
    if (activePack) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRenamePackValue(activePack.label);
      setIsRenamingPack(false);
    }
  }, [activePack]);

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
    [packs, expanded, index, dispatch],
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

  const handleCreatePack = () => {
    const label = newPackLabel.trim();
    if (!label) return;
    dispatch(
      addPack({
        label,
        topics: [],
      }),
    );
    dispatch(setActiveTopicPack(label));
    setNewPackLabel("");
  };

  const handleStartRenamePack = () => {
    setRenamePackValue(activePack.label);
    setIsRenamingPack(true);
  };

  const handleCancelRenamePack = () => {
    setIsRenamingPack(false);
    setRenamePackValue(activePack.label);
  };

  const handleSavePackRename = () => {
    const newLabel = renamePackValue.trim();
    if (!newLabel || newLabel === activePack.label) {
      setIsRenamingPack(false);
      return;
    }
    dispatch(
      renamePack({
        oldLabel: activePack.label,
        newLabel,
      }),
    );
    setIsRenamingPack(false);
  };

  const handleDeletePack = () => {
    if (!activePack) return;
    dispatch(removePack(activePack.label));
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

  return (
  <div className="mx-auto w-full bg-[#fbfbfe] max-w-90 p-3 sm:p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/80 font-sans">
      {/* ── Tab bar ────────────────────────────────────────────────── */}
<div
        ref={trackRef}
        role="tablist"
        aria-label="Topic Packs"
        tabIndex={0}
        // Simplified container: removed heavy padding/background since items now have borders
        className="flex flex-wrap items-center gap-2 outline-none max-w-85 focus-visible:ring-2 focus-visible:ring-blue-500/40"
      >
        {packs.map((pack: TopicsPack, i: number) => {
          const active = pack.label === preference.activeTopicPack;

          return (
            <button
              key={pack.label}
              role="tab"
              aria-selected={active}
              onClick={() => goTo(i)}
              className={`
                relative px-3 py-1.5 text-sm font-medium max-w-85 transition-all duration-200 z-10
                border rounded-lg whitespace-nowrap
                ${
                  active
                    ? "border-blue-200 text-blue-900"
                    : "border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 hover:bg-gray-50"
                }
              `}
            >
              {active && (
                <motion.span
                  layoutId="active-pill"
                  // Matched the border-radius (rounded-lg) and adjusted the background
                  className="absolute inset-0 rounded-lg bg-blue-50/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ring-1 ring-blue-500/10"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <span className={`relative z-20 ${active ? "font-semibold text-blue-700" : ""}`}>
                {pack.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Centered "Topics" Toggle Button ────────────────────────── */}
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-gray-700 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 transition-all hover:shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:text-blue-600"
        >
          Topics
          <motion.svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            className="text-blue-500"
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <path d="M4 6.5 8 10l4-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
            className="overflow-hidden max-w-85"
          >
            <div className="pt-4 pb-1">
              <div className="relative min-h-90 max-w-85 overflow-hidden rounded-3xl bg-white shadow-[0_2px_20px_rgba(0,0,0,0.03)] border border-gray-100/80">
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  <motion.article
                    key={activePack.label}
                    custom={direction}
                    variants={prefersReducedMotion ? undefined : contentVariants}
                    initial={prefersReducedMotion ? undefined : "enter"}
                    animate="center"
                    exit={prefersReducedMotion ? undefined : "exit"}
                    className="flex h-full flex-col p-4 sm:p-5"
                  >
                    
                    {/* Header & Pack Actions (Icon Based) */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                        </div>
                        <h2 className="text-base font-bold text-gray-900 tracking-tight">
                          {activePack.label}
                        </h2>
                      </div>

                      <div className="flex items-center gap-1">
                        {isRenamingPack ? (
                          <div className="flex items-center gap-1 bg-gray-50/80 p-1 rounded-xl border border-gray-100">
                            <input
                              type="text"
                              value={renamePackValue}
                              onChange={(e) => setRenamePackValue(e.target.value)}
                              autoFocus
                              className="w-24 bg-transparent px-2 py-1 text-xs text-gray-700 focus:outline-none"
                            />
                            <button onClick={handleSavePackRename} disabled={!renamePackValue.trim() || renamePackValue === activePack.label} className="p-1 text-emerald-500 hover:bg-emerald-50 rounded-lg disabled:opacity-30 transition-colors">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                            </button>
                            <button onClick={handleCancelRenamePack} className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-lg transition-colors">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-0.5">
                            {isCardPack && (
                              <button
                                onClick={() => dispatch(resetPackTopics(activePack.label))}
                                className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Reset Pack Topics"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4.93 4.93a10 10 0 1 1-1.414 1.414" />
                                  <path d="M4 4v5h5" />
                                </svg>
                              </button>
                            )}
                            <button onClick={handleStartRenamePack} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Rename Pack">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                            </button>
                            <button onClick={handleDeletePack} disabled={packs.length <= 1} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30 transition-colors" title="Delete Pack">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Compact Inputs Area */}
                    <div className="flex flex-col gap-2 mb-4">
                      {/* Topic Input - Prominent Gradient */}
                      <form onSubmit={handleAddTopic} className="flex gap-2">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Add new topic..."
                          className="flex-1 rounded-xl bg-gray-50/60 border border-gray-100 px-3.5 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)]"
                        />
                        <button
                          type="submit"
                          disabled={!inputValue.trim()}
                          className="flex items-center justify-center rounded-xl bg-gradient-to-r from-[#7F80FF] to-[#A87CFF] px-4 py-2 text-white shadow-sm hover:opacity-90 disabled:opacity-50 transition-all"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                        </button>
                      </form>

                      {/* Add Pack - Subtle */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newPackLabel}
                          onChange={(e) => setNewPackLabel(e.target.value)}
                          placeholder="Or create a new pack..."
                          className="flex-1 rounded-xl bg-transparent border border-dashed border-gray-200 px-3.5 py-1.5 text-xs text-gray-600 focus:outline-none focus:border-blue-300 focus:bg-blue-50/30 transition-all"
                        />
                        <button
                          type="button"
                          onClick={handleCreatePack}
                          disabled={!newPackLabel.trim()}
                          className="flex items-center justify-center rounded-xl border border-gray-100 bg-white px-3 py-1.5 text-gray-500 hover:text-blue-500 hover:bg-gray-50 shadow-sm disabled:opacity-50 transition-all"
                          title="Add Pack"
                        >
                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                        </button>
                      </div>
                    </div>

                    {/* Draggable/Editable List Area */}
                    <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-1 pb-1">
                      {currentTopics.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-24 text-gray-400">
                          <p className="text-sm">Empty pack.</p>
                        </div>
                      ) : (
                        currentTopics.map((topic, i) => (
                          <div
                            key={topic.id}
                            className="group flex items-center justify-between gap-2 p-2.5 bg-white border border-gray-100/80 rounded-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-blue-100 transition-all"
                          >
                            {/* Text / Edit Mode */}
                            <div className="flex-1 min-w-0 pl-1">
                              {editingId === topic.id ? (
                                <input
                                  autoFocus
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSaveEdit(topic.id);
                                    if (e.key === "Escape") setEditingId(null);
                                  }}
                                  className="w-full rounded-md border border-blue-300 px-2 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                />
                              ) : (
                                <p className="text-sm font-medium text-gray-700 truncate leading-snug">
                                  {topic.topic}
                                </p>
                              )}
                            </div>

                            {/* Actions Grouped on Right */}
                            <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity bg-white">
                              {/* Reorder Controls */}
                              <div className="flex items-center border-r border-gray-100 pr-0.5 mr-0.5">
                                <button onClick={() => moveUp(i)} disabled={i === 0} className="p-1 text-gray-300 hover:text-blue-500 disabled:opacity-30 transition-colors">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                                </button>
                                <button onClick={() => moveDown(i)} disabled={i === currentTopics.length - 1} className="p-1 text-gray-300 hover:text-blue-500 disabled:opacity-30 transition-colors">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                </button>
                              </div>

                              {/* Edit/Save/Delete */}
                              {editingId === topic.id ? (
                                <button onClick={() => handleSaveEdit(topic.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                                </button>
                              ) : (
                                <>
                                  <button onClick={() => { setEditingId(topic.id); setEditValue(topic.topic); }} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                                  </button>
                                  <button onClick={() => handleDelete(topic.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
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
