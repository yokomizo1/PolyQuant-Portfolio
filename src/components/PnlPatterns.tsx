import { useAnalytics } from "@/hooks/useBackendData";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function PnlPatterns() {
  const { data, isLoading, isError } = useAnalytics();

  if (isLoading) return <Skeleton className="h-72 w-full rounded-xl" />;
  if (isError || !data) return null;

  const { time_patterns } = data;
  const hourly = time_patterns.by_hour.filter((h) => h.trades > 0);
  const dow = time_patterns.by_dow.filter((d) => d.trades > 0);

  if (!hourly.length && !dow.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Hourly P&L */}
      {hourly.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-mono font-medium text-muted-foreground mb-3">
            P&L by Hour (UTC)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hourly}>
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 9, fontFamily: "monospace" }}
                tickFormatter={(h: number) => `${h}h`}
              />
              <YAxis tick={{ fontSize: 9, fontFamily: "monospace" }} tickFormatter={(v: number) => `$${v}`} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontFamily: "monospace",
                  fontSize: 11,
                }}
                formatter={(v: number) => [`$${v.toFixed(2)}`, "P&L"]}
                labelFormatter={(h) => `${h}:00 UTC`}
              />
              <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                {hourly.map((entry) => (
                  <Cell
                    key={`h-${entry.hour}`}
                    fill={entry.pnl >= 0 ? "#10b981" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Day of Week P&L */}
      {dow.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-mono font-medium text-muted-foreground mb-3">
            P&L by Day of Week
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dow}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: "monospace" }} />
              <YAxis tick={{ fontSize: 9, fontFamily: "monospace" }} tickFormatter={(v: number) => `$${v}`} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontFamily: "monospace",
                  fontSize: 11,
                }}
                formatter={(v: number) => [`$${v.toFixed(2)}`, "P&L"]}
              />
              <Bar dataKey="pnl" radius={[3, 3, 0, 0]}>
                {dow.map((entry) => (
                  <Cell
                    key={`d-${entry.day}`}
                    fill={entry.pnl >= 0 ? "#10b981" : "#ef4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
