import { useAnalytics } from "@/hooks/useBackendData";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const FUNNEL_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd"];
const ENGINE_COLORS: Record<string, string> = {
  binance: "#f59e0b",
  monitor_ai: "#6366f1",
  ai_model: "#10b981",
  consistency: "#ef4444",
  pinnacle: "#3b82f6",
};

export default function SignalFunnel() {
  const { data, isLoading, isError } = useAnalytics();

  if (isLoading) return <Skeleton className="h-80 w-full rounded-xl" />;
  if (isError || !data) return null;

  const { funnel } = data;
  if (!funnel.stages.length) return null;

  const engineData = Object.entries(funnel.by_engine)
    .map(([engine, stats]) => ({
      engine,
      total: stats.total,
      filled: stats.filled,
      conversion_pct: stats.conversion_pct,
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-4">
      {/* Funnel bars */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-sm font-mono font-medium text-muted-foreground mb-3">
          Signal Funnel — {funnel.total.toLocaleString()} total signals
        </h3>
        <div className="space-y-2">
          {funnel.stages.map((stage, i) => (
            <div key={stage.name} className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-foreground">{stage.name}</span>
                <span className="text-muted-foreground">
                  {stage.count.toLocaleString()} ({stage.pct}%)
                </span>
              </div>
              <div className="w-full bg-secondary/30 rounded-full h-5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${stage.pct}%`,
                    background: FUNNEL_COLORS[i] || FUNNEL_COLORS[3],
                    minWidth: stage.pct > 0 ? "2px" : "0",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Rejection breakdown */}
        {funnel.rejections && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
            {Object.entries(funnel.rejections).map(([reason, count]) => (
              <div key={reason} className="bg-secondary/20 rounded-lg p-2 text-center">
                <div className="text-xs font-mono text-muted-foreground capitalize">
                  {reason.replace("_", " ")}
                </div>
                <div className="text-sm font-mono font-semibold text-foreground">
                  {(count as number).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Engine conversion chart */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-sm font-mono font-medium text-muted-foreground mb-3">
          Conversion by Engine
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={engineData} layout="vertical">
            <XAxis type="number" tick={{ fontSize: 10, fontFamily: "monospace" }} />
            <YAxis
              type="category"
              dataKey="engine"
              tick={{ fontSize: 10, fontFamily: "monospace" }}
              width={90}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontFamily: "monospace",
                fontSize: 11,
              }}
              formatter={(value: number, name: string) =>
                name === "total"
                  ? [value.toLocaleString(), "Total"]
                  : [value.toLocaleString(), "Filled"]
              }
            />
            <Bar dataKey="total" fill="hsl(var(--muted))" radius={[0, 4, 4, 0]}>
              {engineData.map((entry) => (
                <Cell key={entry.engine} fill={ENGINE_COLORS[entry.engine] || "#6b7280"} opacity={0.3} />
              ))}
            </Bar>
            <Bar dataKey="filled" radius={[0, 4, 4, 0]}>
              {engineData.map((entry) => (
                <Cell key={entry.engine} fill={ENGINE_COLORS[entry.engine] || "#6b7280"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 mt-2">
          {engineData.map((e) => (
            <span key={e.engine} className="text-[10px] font-mono text-muted-foreground">
              <span
                className="inline-block w-2 h-2 rounded-full mr-1"
                style={{ backgroundColor: ENGINE_COLORS[e.engine] || "#6b7280" }}
              />
              {e.engine}: {e.conversion_pct}% fill rate
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
