import { useState } from "react";
import KpiRow from "@/components/KpiRow";
import EquityChart from "@/components/EquityChart";
import OpportunitiesTable from "@/components/OpportunitiesTable";
import OpenPositions from "@/components/OpenPositions";
import MetricsPanel from "@/components/MetricsPanel";
import SignalFunnel from "@/components/SignalFunnel";
import TradeTimeline from "@/components/TradeTimeline";
import CalibrationHeatmap from "@/components/CalibrationHeatmap";
import PnlPatterns from "@/components/PnlPatterns";
import RejectionLog from "@/components/RejectionLog";
import RiskDashboard from "@/components/RiskDashboard";
import WhaleSignals from "@/components/WhaleSignals";

type Tab = "opportunities" | "positions" | "metrics" | "funnel" | "timeline" | "calibration" | "pnl" | "rejections" | "risk" | "whales";

const TABS: [Tab, string][] = [
  ["opportunities", "Live Opportunities"],
  ["positions", "Open Positions"],
  ["metrics", "Metrics"],
  ["funnel", "Signal Funnel"],
  ["timeline", "Timeline"],
  ["calibration", "Calibration"],
  ["pnl", "P&L Patterns"],
  ["rejections", "Rejections"],
  ["risk", "Risk"],
  ["whales", "🐋 Copy Trade"],
];

const Dashboard = () => {
  const [tab, setTab] = useState<Tab>("opportunities");

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <KpiRow />
      <EquityChart />

      {/* Tab selector */}
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/50 border border-border w-max min-w-full sm:w-fit">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`text-xs font-mono px-3 py-2 rounded-md transition-all whitespace-nowrap ${
                tab === key
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "opportunities" && <OpportunitiesTable />}
      {tab === "positions" && <OpenPositions />}
      {tab === "metrics" && <MetricsPanel />}
      {tab === "funnel" && <SignalFunnel />}
      {tab === "timeline" && <TradeTimeline />}
      {tab === "calibration" && <CalibrationHeatmap />}
      {tab === "pnl" && <PnlPatterns />}
      {tab === "rejections" && <RejectionLog />}
      {tab === "risk" && <RiskDashboard />}
      {tab === "whales" && <WhaleSignals />}

      <footer className="text-center py-6 space-y-1">
        <p className="text-xs font-mono text-muted-foreground/60">
          ⚠ Trading involves significant risk. PolyQuant is a quantitative analysis tool, not financial advice.
        </p>
        <p className="text-[10px] font-mono text-muted-foreground/40">
          PolyQuant Bot v1.0 — Paper trading with real Polymarket data.
        </p>
      </footer>
    </main>
  );
};

export default Dashboard;
