import { useAnalytics } from "@/hooks/useBackendData";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, AlertTriangle, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const GAUGE_THRESHOLDS = {
  utilization: { warn: 40, danger: 60 },
  drawdown: { warn: 10, danger: 20 },
  concentration: { warn: 25, danger: 40 },
};

function GaugeCard({
  label,
  value,
  unit,
  thresholds,
}: {
  label: string;
  value: number;
  unit: string;
  thresholds: { warn: number; danger: number };
}) {
  const color =
    value >= thresholds.danger
      ? "text-red-400"
      : value >= thresholds.warn
      ? "text-yellow-400"
      : "text-green-400";
  const bg =
    value >= thresholds.danger
      ? "bg-red-400/10"
      : value >= thresholds.warn
      ? "bg-yellow-400/10"
      : "bg-green-400/10";
  const icon =
    value >= thresholds.danger ? (
      <AlertTriangle className="w-4 h-4 text-red-400" />
    ) : value >= thresholds.warn ? (
      <TrendingDown className="w-4 h-4 text-yellow-400" />
    ) : (
      <Shield className="w-4 h-4 text-green-400" />
    );

  return (
    <div className={`${bg} rounded-lg p-3`}>
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-[10px] font-mono text-muted-foreground uppercase">{label}</span>
      </div>
      <div className={`text-xl font-mono font-bold ${color}`}>
        {value.toFixed(1)}
        <span className="text-xs">{unit}</span>
      </div>
      {/* Gauge bar */}
      <div className="w-full bg-secondary/30 rounded-full h-1.5 mt-2">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            value >= thresholds.danger
              ? "bg-red-400"
              : value >= thresholds.warn
              ? "bg-yellow-400"
              : "bg-green-400"
          }`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

const CAT_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899"];

export default function RiskDashboard() {
  const { data, isLoading, isError } = useAnalytics();

  if (isLoading) return <Skeleton className="h-72 w-full rounded-xl" />;
  if (isError || !data) return null;

  const g = data.risk_gauges;

  const catData = Object.entries(g.category_breakdown).map(([name, value], i) => ({
    name,
    value,
    color: CAT_COLORS[i % CAT_COLORS.length],
  }));

  return (
    <div className="space-y-4">
      {/* Gauge cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <GaugeCard
          label="Capital Utilization"
          value={g.utilization_pct}
          unit="%"
          thresholds={GAUGE_THRESHOLDS.utilization}
        />
        <GaugeCard
          label="Current Drawdown"
          value={g.current_drawdown_pct}
          unit="%"
          thresholds={GAUGE_THRESHOLDS.drawdown}
        />
        <GaugeCard
          label="Position Concentration"
          value={g.concentration_pct}
          unit="%"
          thresholds={GAUGE_THRESHOLDS.concentration}
        />
      </div>

      {/* Risk summary + pie chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-mono font-medium text-muted-foreground mb-3">Risk Summary</h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Equity (NAV)</span>
              <span className="text-foreground">${g.equity.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bankroll (Cash)</span>
              <span className="text-foreground">${g.bankroll.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Open Exposure</span>
              <span className="text-foreground">${g.open_exposure.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">High Watermark</span>
              <span className="text-foreground">${g.high_watermark.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Largest Position</span>
              <span className="text-foreground">${g.max_position_usd}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Top Category</span>
              <span className="text-foreground">
                {g.top_category} (${g.top_category_exposure})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Open Positions</span>
              <span className="text-foreground">{g.positions_count}</span>
            </div>
          </div>
        </div>

        {/* Category allocation pie */}
        {catData.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-mono font-medium text-muted-foreground mb-3">
              Category Allocation
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={catData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  innerRadius={35}
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={2}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {catData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontFamily: "monospace",
                    fontSize: 11,
                  }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "Exposure"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
