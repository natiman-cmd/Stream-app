export type Sport = "Football" | "Basketball" | "Tennis" | "Volleyball" | "Cricket" | "Virtual Sports";

export interface MatchMarket {
  id: string;
  label: string;
  odds: number;
}

export interface Match {
  id: string;
  sport: Sport;
  league: string;
  country: string;
  home: string;
  away: string;
  startTime: string;
  status: "upcoming" | "live";
  markets: MatchMarket[];
}

export const SPORTS: { name: Sport; icon: string; count: number }[] = [
  { name: "Football", icon: "circle", count: 749 },
  { name: "Basketball", icon: "circle", count: 57 },
  { name: "Tennis", icon: "circle", count: 16 },
  { name: "Volleyball", icon: "circle", count: 15 },
  { name: "Cricket", icon: "circle", count: 7 },
  { name: "Virtual Sports", icon: "target", count: 24 },
];

export const TOP_LEAGUES = [
  "Europe · UEFA Champions League",
  "England · Premier League",
  "Spain · La Liga",
  "Germany · Bundesliga",
  "Italy · Serie A",
  "Africa · CAF Champions League",
];

export const MATCHES: Match[] = [
  {
    id: "inter-hacken",
    sport: "Football",
    league: "Europe · UEFA Champions League",
    country: "Europe",
    home: "Inter Milano W",
    away: "BK Hacken W",
    startTime: "Today · 12:45",
    status: "upcoming",
    markets: [
      { id: "home", label: "1", odds: 2.29 },
      { id: "draw", label: "X", odds: 3.35 },
      { id: "away", label: "2", odds: 2.71 },
      { id: "home-draw", label: "1X", odds: 1.36 },
      { id: "draw-away", label: "X2", odds: 1.5 },
      { id: "both-yes", label: "Yes", odds: 1.58 },
      { id: "both-no", label: "No", odds: 2.12 },
    ],
  },
  {
    id: "bayern-city",
    sport: "Football",
    league: "Europe · UEFA Champions League",
    country: "Europe",
    home: "FC Bayern Munchen W",
    away: "Manchester City LFC W",
    startTime: "Today · 12:45",
    status: "upcoming",
    markets: [
      { id: "home", label: "1", odds: 2.05 },
      { id: "draw", label: "X", odds: 3.71 },
      { id: "away", label: "2", odds: 2.87 },
      { id: "home-draw", label: "1X", odds: 1.32 },
      { id: "draw-away", label: "X2", odds: 1.63 },
      { id: "both-yes", label: "Yes", odds: 1.47 },
      { id: "both-no", label: "No", odds: 2.63 },
    ],
  },
  {
    id: "arsenal-koge",
    sport: "Football",
    league: "Europe · UEFA Champions League Women",
    country: "Europe",
    home: "Arsenal Women",
    away: "HB Koge Women",
    startTime: "Today · 15:00",
    status: "upcoming",
    markets: [
      { id: "home", label: "1", odds: 1.06 },
      { id: "draw", label: "X", odds: 8.32 },
      { id: "away", label: "2", odds: 22.4 },
      { id: "home-draw", label: "1X", odds: 1.08 },
      { id: "draw-away", label: "X2", odds: 5.94 },
      { id: "both-yes", label: "Yes", odds: 2.58 },
      { id: "both-no", label: "No", odds: 1.39 },
    ],
  },
  {
    id: "juventus-benfica",
    sport: "Football",
    league: "Europe · UEFA Champions League Women",
    country: "Europe",
    home: "Juventus Women",
    away: "SL Benfica Women",
    startTime: "Today · 15:00",
    status: "upcoming",
    markets: [
      { id: "home", label: "1", odds: 1.75 },
      { id: "draw", label: "X", odds: 3.84 },
      { id: "away", label: "2", odds: 3.66 },
      { id: "home-draw", label: "1X", odds: 1.2 },
      { id: "draw-away", label: "X2", odds: 1.86 },
      { id: "both-yes", label: "Yes", odds: 1.57 },
      { id: "both-no", label: "No", odds: 2.14 },
    ],
  },
  {
    id: "lakers-celtics",
    sport: "Basketball",
    league: "USA · NBA",
    country: "USA",
    home: "Los Angeles Lakers",
    away: "Boston Celtics",
    startTime: "Tomorrow · 02:30",
    status: "upcoming",
    markets: [
      { id: "home", label: "1", odds: 1.82 },
      { id: "away", label: "2", odds: 2.02 },
      { id: "home-spread", label: "1 (-3.5)", odds: 1.91 },
      { id: "away-spread", label: "2 (+3.5)", odds: 1.91 },
      { id: "over", label: "Over 218.5", odds: 1.88 },
      { id: "under", label: "Under 218.5", odds: 1.92 },
    ],
  },
  {
    id: "nadal-sinner",
    sport: "Tennis",
    league: "World · ATP Masters",
    country: "World",
    home: "Rafael Nadal",
    away: "Jannik Sinner",
    startTime: "Tomorrow · 17:00",
    status: "upcoming",
    markets: [
      { id: "home", label: "1", odds: 2.65 },
      { id: "away", label: "2", odds: 1.48 },
      { id: "sets-over", label: "Over 2.5 sets", odds: 1.72 },
      { id: "sets-under", label: "Under 2.5 sets", odds: 2.02 },
    ],
  },
];

export function getMatch(id: string | undefined) {
  return MATCHES.find((match) => match.id === id);
}