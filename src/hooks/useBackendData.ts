import { useQuery } from "@tanstack/react-query";

export interface PortfolioData {
  bankroll: number;
  starting_bankroll: number;
  equity: number;
  roi_pct: number;
  win_rate: number;
  total_pnl: number;
  wins: number;
  losses: number;
  n_resolved: number;
  open_count: number;
  open_exposure: number;
  active_engines: number;
  high_watermark: number;
  created_at: string;
  updated_at: string;
  category_exposure: Record<string, number>;
  category_pnl: Record<string, { pnl: number; wins: number; total: number }>;
  engine_pnl: Record<string, { pnl: number; wins: number; total: number }>;
}

export interface OpenPosition {
  trade_id: string;
  market_id: string;
  question: string;
  category: string;
  bet_size_usd: number;
  entry_price: number;
  model_prob: number;
  expected_ev: number;
  kelly_fraction: number;
  side: string;
  engine_source: string;
  opened_at: string;
  polymarket_url?: string;
}

export interface EquityPoint {
  date: string;
  equity: number;
  trade?: string;
  pnl?: number;
}

export interface Opportunity {
  id: string;
  event: string;
  category: string;
  odds: number;
  trueProb: number;
  ev: number;
  stake: number;
  slug: string | null;
  side?: string;
  engine?: string;
  status?: string;
  polymarket_url?: string;
}

export interface MetricsData {
  summary: {
    total_trades: number;
    wins: number;
    losses: number;
    win_rate: number;
    total_pnl: number;
    avg_pnl_per_trade: number;
    avg_win: number;
    avg_loss: number;
    profit_factor: number | null;
    total_staked: number;
    roi_on_staked: number;
  };
  risk: {
    max_drawdown_usd: number;
    max_drawdown_pct: number;
    sharpe_ratio: number;
    avg_hold_hours: number;
    high_watermark: number;
  };
  calibration: {
    brier_score: number | null;
    n_calibrated: number;
  };
  engine_stats: Record<string, { trades: number; wins: number; pnl: number; win_rate: number; roi: number; avg_pnl: number }>;
  category_stats: Record<string, { trades: number; wins: number; pnl: number; win_rate: number; roi: number; stakes: number }>;
  daily_pnl: { date: string; pnl: number }[];
  signal_volume: Record<string, number>;
}

export interface FunnelStage {
  name: string;
  count: number;
  pct: number;
}

export interface FunnelByEngine {
  total: number;
  filled: number;
  rejected: number;
  conversion_pct: number;
}

export interface TimelineEvent {
  timestamp: string;
  engine: string;
  market: string;
  side: string;
  status: string;
  stake: number;
  ev: number;
  rejection_reason: string;
}

export interface CalibrationBin {
  bin: string;
  predicted: number;
  actual: number;
  count: number;
  gap: number;
}

export interface TimePatternEntry {
  hour?: number;
  day?: string;
  pnl: number;
  trades: number;
}

export interface RejectionEntry {
  timestamp: string;
  engine: string;
  market: string;
  side: string;
  stake: number;
  ev: number;
  reason: string;
}

export interface RiskGauges {
  equity: number;
  bankroll: number;
  open_exposure: number;
  high_watermark: number;
  current_drawdown_pct: number;
  utilization_pct: number;
  max_position_usd: number;
  concentration_pct: number;
  category_concentration_pct: number;
  top_category: string;
  top_category_exposure: number;
  positions_count: number;
  category_breakdown: Record<string, number>;
}

export interface AnalyticsData {
  funnel: {
    total: number;
    stages: FunnelStage[];
    rejections: Record<string, number>;
    by_engine: Record<string, FunnelByEngine>;
  };
  timeline: TimelineEvent[];
  calibration_bins: CalibrationBin[];
  time_patterns: {
    by_hour: TimePatternEntry[];
    by_dow: TimePatternEntry[];
  };
  rejection_log: RejectionEntry[];
  risk_gauges: RiskGauges;
}

export interface WhaleSignal {
  market_id: string;
  question: string;
  yes_price: number;
  no_price: number;
  volume_24h: number;
  liquidity: number;
  price_change_1d: number;
  smart_money_score: number;
  signal_side: string;
  clob_large_orders: number;
  clob_imbalance: number;
  polymarket_url: string;
  days_out: number;
}

export interface WhaleSignalsData {
  signals: WhaleSignal[];
  scanned_at: string;
  error?: string;
}

export interface TradeHistoryItem {
  timestamp: string;
  engine: string;
  market: string;
  category: string;
  side: string;
  status: string;
  stake: number;
  entry_price: number;
  ev: number;
  pnl: number | null;
  result: "WIN" | "LOSS" | "OPEN";
  market_id: string;
}

export interface TradeHistoryResponse {
  items: TradeHistoryItem[];
  total: number;
  page: number;
  limit: number;
  available_engines: string[];
  available_categories: string[];
  summary: { wins: number; losses: number; total_pnl: number; total_staked: number };
}

export interface TradeHistoryFilters {
  result?: string;
  status?: string;
  category?: string;
  engine?: string;
}

const portfolio: PortfolioData = {
  bankroll: 11842.5,
  starting_bankroll: 10000,
  equity: 12480.25,
  roi_pct: 24.8,
  win_rate: 61.4,
  total_pnl: 2480.25,
  wins: 43,
  losses: 27,
  n_resolved: 70,
  open_count: 5,
  open_exposure: 637.75,
  active_engines: 5,
  high_watermark: 12790.4,
  created_at: "2026-04-01T12:00:00Z",
  updated_at: "2026-04-26T05:30:00Z",
  category_exposure: { Crypto: 312.5, Sports: 185.25, Weather: 90, Esports: 50 },
  category_pnl: {
    Crypto: { pnl: 1380.2, wins: 24, total: 35 },
    Sports: { pnl: 740.4, wins: 12, total: 20 },
    Weather: { pnl: 210.1, wins: 5, total: 9 },
    Esports: { pnl: 149.55, wins: 2, total: 6 },
  },
  engine_pnl: {
    volatility: { pnl: 1240.1, wins: 18, total: 28 },
    base_rate: { pnl: 520.5, wins: 9, total: 15 },
    order_flow: { pnl: 390.2, wins: 8, total: 12 },
    weather: { pnl: 210.1, wins: 5, total: 9 },
    research: { pnl: 119.35, wins: 3, total: 6 },
  },
};

const equityHistory: EquityPoint[] = [
  { date: "2026-04-01", equity: 10000, pnl: 0 },
  { date: "2026-04-05", equity: 10480, pnl: 480 },
  { date: "2026-04-09", equity: 10320, pnl: -160 },
  { date: "2026-04-13", equity: 11140, pnl: 820 },
  { date: "2026-04-17", equity: 11680, pnl: 540 },
  { date: "2026-04-21", equity: 12110, pnl: 430 },
  { date: "2026-04-26", equity: 12480.25, pnl: 370.25 },
];

const opportunities: Opportunity[] = [
  { id: "demo-1", event: "BTC daily range closes inside target band", category: "Crypto", odds: 0.42, trueProb: 0.58, ev: 0.16, stake: 125, slug: null, side: "YES", engine: "volatility", status: "SIGNAL" },
  { id: "demo-2", event: "Top seed advances in tennis matchup", category: "Sports", odds: 0.51, trueProb: 0.62, ev: 0.11, stake: 90, slug: null, side: "YES", engine: "base_rate", status: "SIGNAL" },
  { id: "demo-3", event: "Weather threshold misses public forecast range", category: "Weather", odds: 0.37, trueProb: 0.28, ev: 0.09, stake: 60, slug: null, side: "NO", engine: "weather", status: "WATCH" },
  { id: "demo-4", event: "Order book imbalance on liquid event market", category: "General", odds: 0.48, trueProb: 0.61, ev: 0.13, stake: 75, slug: null, side: "YES", engine: "order_flow", status: "SIGNAL" },
];

const positions: OpenPosition[] = [
  { trade_id: "T-1001", market_id: "demo-1", question: "BTC daily range closes inside target band", category: "Crypto", bet_size_usd: 125, entry_price: 0.42, model_prob: 0.58, expected_ev: 0.16, kelly_fraction: 0.08, side: "YES", engine_source: "volatility", opened_at: "2026-04-26T02:15:00Z" },
  { trade_id: "T-1002", market_id: "demo-2", question: "Top seed advances in tennis matchup", category: "Sports", bet_size_usd: 90, entry_price: 0.51, model_prob: 0.62, expected_ev: 0.11, kelly_fraction: 0.06, side: "YES", engine_source: "base_rate", opened_at: "2026-04-25T22:20:00Z" },
  { trade_id: "T-1003", market_id: "demo-3", question: "Weather threshold misses public forecast range", category: "Weather", bet_size_usd: 60, entry_price: 0.63, model_prob: 0.72, expected_ev: 0.09, kelly_fraction: 0.04, side: "NO", engine_source: "weather", opened_at: "2026-04-25T18:05:00Z" },
];

const metrics: MetricsData = {
  summary: {
    total_trades: 70,
    wins: 43,
    losses: 27,
    win_rate: 61.4,
    total_pnl: 2480.25,
    avg_pnl_per_trade: 35.43,
    avg_win: 108.2,
    avg_loss: -62.4,
    profit_factor: 2.76,
    total_staked: 6840,
    roi_on_staked: 36.3,
  },
  risk: {
    max_drawdown_usd: 510.2,
    max_drawdown_pct: 4.1,
    sharpe_ratio: 1.84,
    avg_hold_hours: 18.6,
    high_watermark: 12790.4,
  },
  calibration: { brier_score: 0.154, n_calibrated: 540 },
  engine_stats: {
    volatility: { trades: 28, wins: 18, pnl: 1240.1, win_rate: 64.3, roi: 44.2, avg_pnl: 44.29 },
    base_rate: { trades: 15, wins: 9, pnl: 520.5, win_rate: 60, roi: 31.5, avg_pnl: 34.7 },
    order_flow: { trades: 12, wins: 8, pnl: 390.2, win_rate: 66.7, roi: 29.1, avg_pnl: 32.52 },
    weather: { trades: 9, wins: 5, pnl: 210.1, win_rate: 55.6, roi: 20.4, avg_pnl: 23.34 },
  },
  category_stats: {
    Crypto: { trades: 35, wins: 24, pnl: 1380.2, win_rate: 68.6, roi: 42.2, stakes: 3270 },
    Sports: { trades: 20, wins: 12, pnl: 740.4, win_rate: 60, roi: 34.6, stakes: 2140 },
    Weather: { trades: 9, wins: 5, pnl: 210.1, win_rate: 55.6, roi: 20.4, stakes: 1030 },
    Esports: { trades: 6, wins: 2, pnl: 149.55, win_rate: 33.3, roi: 37.4, stakes: 400 },
  },
  daily_pnl: [
    { date: "Apr 20", pnl: 210 },
    { date: "Apr 21", pnl: -80 },
    { date: "Apr 22", pnl: 340 },
    { date: "Apr 23", pnl: 190 },
    { date: "Apr 24", pnl: -45 },
    { date: "Apr 25", pnl: 280 },
    { date: "Apr 26", pnl: 155 },
  ],
  signal_volume: { accepted: 34, rejected: 51, watch: 15 },
};

const analytics: AnalyticsData = {
  funnel: {
    total: 180,
    stages: [
      { name: "Scanned", count: 180, pct: 100 },
      { name: "Classified", count: 126, pct: 70 },
      { name: "Priced", count: 82, pct: 45.6 },
      { name: "Passed Risk", count: 34, pct: 18.9 },
      { name: "Filled", count: 18, pct: 10 },
    ],
    rejections: {
      "low liquidity": 18,
      "correlated exposure": 12,
      "weak signal": 15,
      "cooldown": 6,
    },
    by_engine: {
      volatility: { total: 62, filled: 9, rejected: 31, conversion_pct: 14.5 },
      base_rate: { total: 48, filled: 5, rejected: 24, conversion_pct: 10.4 },
      order_flow: { total: 40, filled: 3, rejected: 18, conversion_pct: 7.5 },
      weather: { total: 30, filled: 1, rejected: 14, conversion_pct: 3.3 },
    },
  },
  timeline: [
    { timestamp: "2026-04-26 05:25 UTC", engine: "volatility", market: "BTC daily range closes inside target band", side: "YES", status: "FILLED", stake: 125, ev: 0.16, rejection_reason: "" },
    { timestamp: "2026-04-26 05:18 UTC", engine: "order_flow", market: "Liquidity imbalance event", side: "YES", status: "WATCH", stake: 0, ev: 0.13, rejection_reason: "" },
    { timestamp: "2026-04-26 05:12 UTC", engine: "weather", market: "Weather threshold misses public range", side: "NO", status: "FILTERED", stake: 0, ev: 0.09, rejection_reason: "risk budget reserved" },
  ],
  calibration_bins: [
    { bin: "20-40%", predicted: 0.31, actual: 0.29, count: 84, gap: 0.02 },
    { bin: "40-60%", predicted: 0.51, actual: 0.54, count: 168, gap: -0.03 },
    { bin: "60-80%", predicted: 0.69, actual: 0.66, count: 142, gap: 0.03 },
    { bin: "80-100%", predicted: 0.86, actual: 0.82, count: 51, gap: 0.04 },
  ],
  time_patterns: {
    by_hour: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      pnl: Math.round(Math.sin(hour / 3) * 120 + 80),
      trades: hour % 4 === 0 ? 4 : 2,
    })),
    by_dow: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => ({
      day,
      pnl: [210, -80, 340, 190, -45, 280, 155][idx],
      trades: [8, 6, 11, 7, 5, 9, 6][idx],
    })),
  },
  rejection_log: [
    { timestamp: "2026-04-26 05:12 UTC", engine: "weather", market: "Weather threshold misses public range", side: "NO", stake: 0, ev: 0.09, reason: "risk budget reserved" },
    { timestamp: "2026-04-26 05:02 UTC", engine: "base_rate", market: "Simulated sports futures market", side: "YES", stake: 0, ev: 0.05, reason: "insufficient liquidity" },
    { timestamp: "2026-04-26 04:55 UTC", engine: "order_flow", market: "Thin order book demonstration", side: "WATCH", stake: 0, ev: 0.07, reason: "spread too wide" },
  ],
  risk_gauges: {
    equity: portfolio.equity,
    bankroll: portfolio.bankroll,
    open_exposure: portfolio.open_exposure,
    high_watermark: portfolio.high_watermark,
    current_drawdown_pct: 2.4,
    utilization_pct: 5.1,
    max_position_usd: 125,
    concentration_pct: 1.0,
    category_concentration_pct: 2.5,
    top_category: "Crypto",
    top_category_exposure: 312.5,
    positions_count: positions.length,
    category_breakdown: portfolio.category_exposure,
  },
};

const whaleSignals: WhaleSignalsData = {
  scanned_at: "2026-04-26T05:30:00Z",
  signals: [
    { market_id: "demo-w1", question: "Liquidity imbalance event", yes_price: 0.48, no_price: 0.52, volume_24h: 184000, liquidity: 42000, price_change_1d: 0.08, smart_money_score: 81, signal_side: "YES", clob_large_orders: 7, clob_imbalance: 0.34, polymarket_url: "", days_out: 2.1 },
    { market_id: "demo-w2", question: "Synthetic macro event market", yes_price: 0.36, no_price: 0.64, volume_24h: 92000, liquidity: 18000, price_change_1d: -0.04, smart_money_score: 68, signal_side: "NO", clob_large_orders: 3, clob_imbalance: -0.21, polymarket_url: "", days_out: 4.5 },
  ],
};

const tradeHistory: TradeHistoryResponse = {
  items: analytics.timeline.map((event, index) => ({
    timestamp: event.timestamp,
    engine: event.engine,
    market: event.market,
    category: index === 0 ? "Crypto" : "General",
    side: event.side,
    status: event.status,
    stake: event.stake,
    entry_price: index === 0 ? 0.42 : 0.51,
    ev: event.ev,
    pnl: index === 0 ? 74.2 : null,
    result: index === 0 ? "WIN" : "OPEN",
    market_id: `demo-history-${index + 1}`,
  })),
  total: 3,
  page: 1,
  limit: 50,
  available_engines: ["volatility", "base_rate", "order_flow", "weather"],
  available_categories: ["Crypto", "Sports", "Weather", "General"],
  summary: { wins: 1, losses: 0, total_pnl: 74.2, total_staked: 125 },
};

const query = <T,>(key: string, data: T) =>
  useQuery({
    queryKey: [key],
    queryFn: async () => data,
    staleTime: Infinity,
  });

export const usePortfolio = () => query("portfolio", portfolio);
export const useOpenPositions = () => query("open-positions", positions);
export const useEquityHistory = () => query("equity-history", equityHistory);
export const useOpportunities = () => query("opportunities", opportunities);
export const useMetrics = () => query("metrics", metrics);
export const useAnalytics = () => query("analytics", analytics);
export const useWhaleSignals = () => query("whale-signals", whaleSignals);
export const useTradeHistory = (_filters: TradeHistoryFilters, _page: number) =>
  query("trade-history", tradeHistory);

export const executeTrade = async (
  signal: Opportunity,
): Promise<{ success: boolean; message: string }> => ({
  success: true,
  message: `${signal.event} added to the review queue.`,
});
