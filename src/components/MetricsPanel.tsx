import { useMetrics } from "@/hooks/useBackendData";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, TrendingDown, Target, Shield, Zap, BarChart3 } from "lucide-react";

const MetricsPanel = () => {
  const { data: metrics, isLoading } = useMetrics();

  if (isLoading || !metrics) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  const { summary, risk, calibration, engine_stats, category_stats, daily_pnl } = metrics;

  const statCards = [
    { label: "Sharpe Ratio", value: risk.sharpe_ratio.toFixed(2), icon: TrendingUp, color: risk.sharpe_ratio > 0 ? "text-primary" : "text-destructive" },
    { label: "Max Drawdown", value: `-${risk.max_drawdown_pct.toFixed(1)}%`, sub: `-$${risk.max_drawdown_usd.toFixed(0)}`, icon: Shield, color: "text-orange-400" },
    { label: "Profit Factor", value: summary.profit_factor?.toFixed(2) ?? "∞", icon: Target, color: (summary.profit_factor ?? 999) > 1 ? "text-primary" : "text-destructive" },
    { label: "Avg Hold Time", value: risk.avg_hold_hours < 24 ? `${risk.avg_hold_hours.toFixed(1)}h` : `${(risk.avg_hold_hours / 24).toFixed(1)}d`, icon: Zap, color: "text-blue-400" },
    { label: "Avg Win", value: `+$${summary.avg_win.toFixed(0)}`, icon: TrendingUp, color: "text-primary" },
    { label: "Avg Loss", value: `-$${Math.abs(summary.avg_loss).toFixed(0)}`, icon: TrendingDown, color: "text-destructive" },
    { label: "ROI on Staked", value: `${summary.roi_on_staked.toFixed(1)}%`, icon: BarChart3, color: summary.roi_on_staked > 0 ? "text-primary" : "text-destructive" },
    { label: "Brier Score", value: calibration.brier_score?.toFixed(4) ?? "N/A", sub: `${calibration.n_calibrated} trades`, icon: Target, color: (calibration.brier_score ?? 1) < 0.25 ? "text-primary" : "text-orange-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((card) => (
          <div key={card.label} className="card-shine rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`w-4 h-4 ${card.color}`} />
              <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{card.label}</span>
            </div>
            <p className={`text-lg font-mono font-bold ${card.color}`}>{card.value}</p>
            {card.sub && <p className="text-xs font-mono text-muted-foreground">{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* Daily P&L chart */}
      <div className="card-shine rounded-lg border border-border p-5">
        <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">Daily P&L</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={daily_pnl} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 16%)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "hsl(215, 14%, 50%)", fontFamily: "JetBrains Mono" }}
              tickFormatter={(v: string) => v.slice(5)}
              axisLine={{ stroke: "hsl(220, 13%, 16%)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(215, 14%, 50%)", fontFamily: "JetBrains Mono" }}
              axisLine={{ stroke: "hsl(220, 13%, 16%)" }}
              tickLine={false}
              tickFormatter={(v: number) => `$${v}`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(220, 13%, 9%)",
                border: "1px solid hsl(220, 13%, 16%)",
                borderRadius: "8px",
                fontFamily: "JetBrains Mono",
                fontSize: "12px",
                color: "hsl(210, 20%, 92%)",
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, "P&L"]}
            />
            <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
              {daily_pnl.map((entry, idx) => (
                <Cell key={idx} fill={entry.pnl >= 0 ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Engine breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-shine rounded-lg border border-border p-5">
          <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">Engine Performance</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Engine", "Trades", "Win%", "P&L", "ROI"].map((h) => (
                  <th key={h} className="text-left py-2 px-2 text-xs font-mono uppercase text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(engine_stats)
                .sort(([, a], [, b]) => b.pnl - a.pnl)
                .map(([eng, s]) => (
                  <tr key={eng} className="border-b border-border/50">
                    <td className="py-2 px-2 font-mono text-foreground">{eng}</td>
                    <td className="py-2 px-2 font-mono text-muted-foreground">{s.trades}</td>
                    <td className="py-2 px-2 font-mono text-muted-foreground">{s.win_rate}%</td>
                    <td className={`py-2 px-2 font-mono font-semibold ${s.pnl >= 0 ? "text-primary" : "text-destructive"}`}>
                      {s.pnl >= 0 ? "+" : ""}${s.pnl.toFixed(0)}
                    </td>
                    <td className={`py-2 px-2 font-mono ${s.roi >= 0 ? "text-primary" : "text-destructive"}`}>
                      {s.roi >= 0 ? "+" : ""}{s.roi}%
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Category breakdown */}
        <div className="card-shine rounded-lg border border-border p-5">
          <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-4">Category Performance</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Category", "Trades", "Win%", "P&L", "ROI"].map((h) => (
                  <th key={h} className="text-left py-2 px-2 text-xs font-mono uppercase text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(category_stats)
                .sort(([, a], [, b]) => b.pnl - a.pnl)
                .map(([cat, s]) => (
                  <tr key={cat} className="border-b border-border/50">
                    <td className="py-2 px-2 font-mono text-foreground capitalize">{cat}</td>
                    <td className="py-2 px-2 font-mono text-muted-foreground">{s.trades}</td>
                    <td className="py-2 px-2 font-mono text-muted-foreground">{s.win_rate}%</td>
                    <td className={`py-2 px-2 font-mono font-semibold ${s.pnl >= 0 ? "text-primary" : "text-destructive"}`}>
                      {s.pnl >= 0 ? "+" : ""}${s.pnl.toFixed(0)}
                    </td>
                    <td className={`py-2 px-2 font-mono ${s.roi >= 0 ? "text-primary" : "text-destructive"}`}>
                      {s.roi >= 0 ? "+" : ""}{s.roi}%
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Signal volume */}
      {metrics.signal_volume && Object.keys(metrics.signal_volume).length > 0 && (
        <div className="card-shine rounded-lg border border-border p-5">
          <h3 className="text-sm font-mono uppercase tracking-widest text-muted-foreground mb-3">Signal Volume (All-Time)</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(metrics.signal_volume).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2">
                <span className={`text-xs font-mono px-2 py-1 rounded-full border ${
                  status === "FILLED" ? "bg-primary/10 text-primary border-primary/20" :
                  status === "REJECTED" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                  "bg-gray-500/10 text-gray-400 border-gray-500/20"
                }`}>
                  {status}
                </span>
                <span className="text-sm font-mono text-foreground">{count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsPanel;
