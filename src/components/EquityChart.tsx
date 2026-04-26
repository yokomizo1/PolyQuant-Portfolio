import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useEquityHistory } from "@/hooks/useBackendData";
import { Skeleton } from "@/components/ui/skeleton";

const EquityChart = () => {
  const { data: equityData, isLoading } = useEquityHistory();

  // Aggregate by date (sum PnL per day)
  const chartData = (() => {
    if (!equityData || equityData.length === 0) return [];
    const byDate: Record<string, number> = {};
    for (const point of equityData) {
      const key = point.date || "unknown";
      byDate[key] = point.equity; // last equity value for that date wins
    }
    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, equity]) => ({
        day: date.slice(5), // "MM-DD"
        equity,
      }));
  })();

  const startingEquity = chartData.length > 0 ? chartData[0].equity : 1000;
  const currentEquity = chartData.length > 0 ? chartData[chartData.length - 1].equity : 1000;
  const isUp = currentEquity >= startingEquity;

  return (
    <div className="card-shine rounded-lg border border-border p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
            Equity Curve
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Paper Trading — {chartData.length} data points · Started $1,000
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isUp ? "bg-primary" : "bg-destructive"} animate-pulse-glow`} />
          <span className={`text-xs font-mono ${isUp ? "text-primary" : "text-destructive"}`}>
            {isUp ? "▲" : "▼"} ${currentEquity.toLocaleString()}
          </span>
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="h-[300px] w-full" />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isUp ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"} stopOpacity={0.3} />
                <stop offset="100%" stopColor={isUp ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 16%)" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: "hsl(215, 14%, 50%)", fontFamily: "JetBrains Mono" }}
              axisLine={{ stroke: "hsl(220, 13%, 16%)" }}
              tickLine={false}
              interval={Math.max(1, Math.floor(chartData.length / 8))}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(215, 14%, 50%)", fontFamily: "JetBrains Mono" }}
              axisLine={{ stroke: "hsl(220, 13%, 16%)" }}
              tickLine={false}
              tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`}
              domain={[(dataMin: number) => Math.floor(dataMin / 100) * 100, (dataMax: number) => Math.ceil(dataMax / 100) * 100]}
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
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Equity"]}
            />
            <Area
              type="monotone"
              dataKey="equity"
              stroke={isUp ? "hsl(142, 71%, 45%)" : "hsl(0, 84%, 60%)"}
              strokeWidth={2}
              fill="url(#equityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default EquityChart;
