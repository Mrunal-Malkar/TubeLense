// Card data for Active Mode.
//
// Each card pairs a "mode" (headspace) with reference sentences ("topics") describing
// the kind of content that belongs in that mode. Embed these once — e.g. with
// Xenova/all-MiniLM-L6-v2 via @xenova/transformers' feature-extraction pipeline —
// mean-pool them into a single reference vector per card, then compare an incoming
// post's embedding against that vector with cosine similarity to score how well it
// fits the selected mode.

import {
  Brain,
  Zap,
  Moon,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Compass,
 type LucideIcon
} from "lucide-react";

export interface CardData {
  id: number;
  title: string;
  name: string;
  description: string;
  icon: LucideIcon;
  colorTheme: string;
  svgColor: string;
  topics: string[];
}

export const CARD_DATA: CardData[] = [
  {
    id: 1,
    title: "Current Card",
    name: "NO BS",
    description: "High focus • Low distraction",
    icon: Brain,
    colorTheme: "emerald",
    svgColor: "#10b981",
    topics: [
      "A clear, step-by-step tutorial that teaches a practical skill.",
      "An in-depth technical explanation written without any clickbait.",
      "A concise summary of new research findings and their implications.",
      "A well-sourced news update reported in a neutral, factual tone.",
      "A thoughtful how-to guide for solving a specific problem.",
      "An educational thread that breaks down a complex topic simply."
    ]
  },
  {
    id: 2,
    title: "Alternative",
    name: "Energy Boost",
    description: "High energy • Fast paced",
    icon: Zap,
    colorTheme: "amber",
    svgColor: "#f59e0b",
    topics: [
      "A high-intensity workout routine designed to get your heart pumping.",
      "An exciting highlight clip from a live sports match.",
      "A fast-paced motivational speech meant to fire you up.",
      "An upbeat playlist recommendation for pushing through a tough day.",
      "A thrilling recap of an action-packed event.",
      "A burst of hype and excitement about an upcoming release."
    ]
  },
  {
    id: 3,
    title: "Rest",
    name: "Wind Down",
    description: "Relaxed • Minimal alerts",
    icon: Moon,
    colorTheme: "indigo",
    svgColor: "#6366f1",
    topics: [
      "A slow, calming video of rain falling outside a window.",
      "A gentle guided meditation to help you fall asleep.",
      "Soft ambient music meant for winding down after a long day.",
      "A peaceful nature scene with birdsong and quiet scenery.",
      "A cozy bedtime story read in a soothing voice.",
      "A relaxing tour through a quiet, softly lit space."
    ]
  },
  {
    id: 4,
    title: "Alternative",
    name: "Playful",
    description: "Light hearted • Just for fun",
    icon: Sparkles,
    colorTheme: "pink",
    svgColor: "#ec4899",
    topics: [
      "A silly meme that makes you laugh out loud.",
      "A lighthearted joke or pun shared just for fun.",
      "A funny video of a pet doing something unexpected.",
      "A playful challenge or game trending among friends.",
      "A witty one-liner poking fun at everyday life.",
      "A goofy skit meant purely to entertain."
    ]
  },
  {
    id: 5,
    title: "Alternative",
    name: "Philosopher",
    description: "Deep dive • Long-form thinking",
    icon: BookOpen,
    colorTheme: "violet",
    svgColor: "#8b5cf6",
    topics: [
      "A long-form essay exploring a big question about life or society.",
      "A thoughtful reflection on an ethical dilemma.",
      "An in-depth analysis connecting history to the present moment.",
      "A nuanced argument that weighs multiple perspectives carefully.",
      "A reflective piece examining the meaning behind an everyday experience.",
      "A well-reasoned essay that challenges a common assumption."
    ]
  },
  {
    id: 6,
    title: "Alternative",
    name: "Debate-Free",
    description: "Calm • No hot takes",
    icon: ShieldCheck,
    colorTheme: "sky",
    svgColor: "#0ea5e9",
    topics: [
      "A calm discussion of a topic that avoids political arguments.",
      "A neutral explainer that presents facts without taking sides.",
      "A peaceful community update with no inflammatory language.",
      "A friendly conversation free of outrage or conflict.",
      "A balanced piece that steers clear of hot-button controversies.",
      "A quiet, drama-free update from a hobby or interest group."
    ]
  },
  {
    id: 7,
    title: "Alternative",
    name: "Explorer",
    description: "Curious • Off the beaten path",
    icon: Compass,
    colorTheme: "teal",
    svgColor: "#14b8a6",
    topics: [
      "A fascinating fact about a topic you've never encountered before.",
      "An unexpected discovery from a completely different field.",
      "A surprising story from a culture or place far from your own.",
      "A curious deep dive into an obscure hobby or niche interest.",
      "An eye-opening perspective from outside your usual interests.",
      "A serendipitous find that broadens what you usually see."
    ]
  }
];