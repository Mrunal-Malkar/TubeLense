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
      "A practical tutorial that teaches a useful skill clearly.",
    ],
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
      "An exciting video that creates energy, motivation, or hype.",
    ],
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
      "A calming video that helps you relax and wind down.",
    ],
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
      "A funny video that entertains without requiring serious thought.",
    ],
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
      "A thoughtful discussion exploring deep questions and ideas.",
    ],
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
      "A neutral discussion that explains a topic without controversy.",
    ],
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
      "A fascinating discovery that introduces something new or unexpected.",
    ],
  },
];