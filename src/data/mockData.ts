export type Kpi = {
  label: string;
  value: string;
  delta: string;
  tone: "good" | "warn" | "neutral";
};

export type Signal = {
  market: string;
  engine: string;
  side: "YES" | "NO" | "WATCH";
  confidence: number;
  status: "Filled" | "Queued" | "Filtered";
};

export type Position = {
  market: string;
  category: string;
  side: "YES" | "NO";
  exposure: string;
  mark: string;
  age: string;
};

export const kpis: Kpi[] = [
  { label: "Research Equity", value: "$12,480", delta: "+18.6% simulated", tone: "good" },
  { label: "Active Engines", value: "5", delta: "mock routing", tone: "neutral" },
  { label: "Signal Precision", value: "63%", delta: "+7 pts trailing", tone: "good" },
  { label: "Risk Utilization", value: "21%", delta: "within policy", tone: "warn" },
];

export const equityCurve = [
  { day: "Mon", equity: 10000 },
  { day: "Tue", equity: 10360 },
  { day: "Wed", equity: 10240 },
  { day: "Thu", equity: 10880 },
  { day: "Fri", equity: 11320 },
  { day: "Sat", equity: 11890 },
  { day: "Sun", equity: 12480 },
];

export const signalMix = [
  { name: "Accepted", value: 34 },
  { name: "Filtered", value: 51 },
  { name: "Watch", value: 15 },
];

export const signals: Signal[] = [
  {
    market: "BTC weekly range resolution",
    engine: "Volatility Surface",
    side: "YES",
    confidence: 82,
    status: "Filled",
  },
  {
    market: "Major tennis match pricing gap",
    engine: "Sports Base Rate",
    side: "WATCH",
    confidence: 68,
    status: "Queued",
  },
  {
    market: "Weather bucket outlier",
    engine: "Weather Model",
    side: "NO",
    confidence: 59,
    status: "Filtered",
  },
  {
    market: "Liquidity imbalance event",
    engine: "Order Book Flow",
    side: "YES",
    confidence: 74,
    status: "Queued",
  },
];

export const positions: Position[] = [
  {
    market: "Crypto daily close band",
    category: "Crypto",
    side: "YES",
    exposure: "$420",
    mark: "+6.4%",
    age: "3h",
  },
  {
    market: "Weather threshold contract",
    category: "Weather",
    side: "NO",
    exposure: "$180",
    mark: "-1.1%",
    age: "7h",
  },
  {
    market: "Sports moneyline proxy",
    category: "Sports",
    side: "YES",
    exposure: "$260",
    mark: "+2.8%",
    age: "1d",
  },
];

export const timeline = [
  "Signal router scored 128 public markets with mock data.",
  "Risk layer filtered correlated exposure cluster.",
  "Dashboard refreshed synthetic equity and position marks.",
  "Watchlist promoted one order-book-flow event for review.",
];
