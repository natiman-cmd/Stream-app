export type GameIcon = "disc" | "shuffle" | "target" | "zap";

export type GameKind = "coin-flip" | "dice" | "roulette" | "lucky-seven";

export interface CasinoGame {
  id: string;
  title: string;
  category: string;
  kind: GameKind;
  icon: GameIcon;
  accent: string;
  description: string;
  tagline: string;
  minStake: number;
  maxStake: number;
  options: string[];
  payoutLabel: string;
}

export const GAMES: CasinoGame[] = [
  {
    id: "neon-coin",
    title: "Neon Coin Flip",
    category: "Quick Play",
    kind: "coin-flip",
    icon: "disc",
    accent: "#00f0ff",
    description: "Pick heads or tails. A clean 50/50 round with instant results.",
    tagline: "Call it. Flip it. Get lucky.",
    minStake: 10,
    maxStake: 250,
    options: ["Heads", "Tails"],
    payoutLabel: "2x on a win",
  },
  {
    id: "cyber-dice",
    title: "Cyber Dice",
    category: "Quick Play",
    kind: "dice",
    icon: "shuffle",
    accent: "#9b8cff",
    description: "Choose high or low, then roll two digital dice against the line.",
    tagline: "High voltage. Higher numbers.",
    minStake: 10,
    maxStake: 300,
    options: ["High", "Low"],
    payoutLabel: "2x on a win",
  },
  {
    id: "prism-roulette",
    title: "Prism Roulette",
    category: "Featured Table",
    kind: "roulette",
    icon: "target",
    accent: "#ffcc66",
    description: "Pick a color on the glowing wheel. Green pays more, red and black pay even.",
    tagline: "Your color. Your call.",
    minStake: 20,
    maxStake: 500,
    options: ["Red", "Black", "Green"],
    payoutLabel: "2x red/black · 14x green",
  },
  {
    id: "lucky-seven",
    title: "Lucky Seven",
    category: "High Multiplier",
    kind: "lucky-seven",
    icon: "zap",
    accent: "#ff6b9d",
    description: "Choose the lucky number seven from a fast ten-number draw.",
    tagline: "One number. One shot.",
    minStake: 10,
    maxStake: 200,
    options: ["7"],
    payoutLabel: "8x on a win",
  },
];

export function getGame(id: string | undefined) {
  return GAMES.find((game) => game.id === id);
}

export function formatCredits(value: number) {
  return `${Math.max(0, Math.round(value)).toLocaleString()} credits`;
}