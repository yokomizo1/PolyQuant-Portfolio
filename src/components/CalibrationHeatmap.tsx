import { useAnalytics } from "@/hooks/useBackendData";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function CalibrationHeatmap() {
  const { data, isLoading, isError } = useAnalytics();

  if (isLoading) return <Skeleton className="h-72 w-full rounded-xl" />;
  if (isError || !data) return null;

  const { calibration_bins } = data;
  if (!calibration_bins.length) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="text-sm font-mono font-medium text-muted-foreground mb-3">
        Model Calibration — Predicted vs Actual
      </h3>

      <ResponsiveContainer width="100%" height={240}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <XAxis
            type="number"
            dataKey="predicted"
            name="Predicted"
            domain={[0, 1]}
            tick={{ fontSize: 10, fontFamily: "monospace" }}
            label={{ value: "Predicted Prob", position: "bottom", fontSize: 10, fontFamily: "monospace" }}
          />
          <YAxis
            type="number"
            dataKey="actual"
            name="Actual"
            domain={[0, 1]}
            tick={{ fontSize: 10, fontFamily: "monospace" }}
            label={{ value: "Actual Rate", angle: -90, position: "insideLeft", fontSize: 10, fontFamily: "monospace" }}
          />
          <ReferenceLine
            segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            opacity={0.4}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontFamily: "monospace",
              fontSize: 11,
            }}
            formatter={(value: number, name: string) => [value.toFixed(3), name]}
            labelFormatter={() => ""}
          />
          <Scatter
            data={calibration_bins}
            fill="#6366f1"
          >
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>

      {/* Calibration table */}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="text-muted-foreground border-b border-border">
              <th className="text-left py-1 px-2">Bin</th>
              <th className="text-right py-1 px-2">Predicted</th>
              <th className="text-right py-1 px-2">Actual</th>
              <th className="text-right py-1 px-2">Gap</th>
              <th className="text-right py-1 px-2">Count</th>
              <th className="text-left py-1 px-2">Assessment</th>
            </tr>
          </thead>
          <tbody>
            {calibration_bins.map((bin) => {
              const assessment =
                Math.abs(bin.gap) < 0.05
                  ? "Well calibrated"
                  : bin.gap > 0
                  ? "Overconfident"
                  : "Underconfident";
              const assessColor =
                Math.abs(bin.gap) < 0.05
                  ? "text-green-400"
                  : bin.gap > 0
                  ? "text-red-400"
                  : "text-yellow-400";
              return (
                <tr key={bin.bin} className="border-b border-border/50 hover:bg-secondary/20">
                  <td className="py-1 px-2 text-foreground">{bin.bin}</td>
                  <td className="py-1 px-2 text-right">{(bin.predicted * 100).toFixed(1)}%</td>
                  <td className="py-1 px-2 text-right">{(bin.actual * 100).toFixed(1)}%</td>
                  <td className={`py-1 px-2 text-right ${assessColor}`}>
                    {bin.gap > 0 ? "+" : ""}
                    {(bin.gap * 100).toFixed(1)}%
                  </td>
                  <td className="py-1 px-2 text-right">{bin.count}</td>
                  <td className={`py-1 px-2 ${assessColor}`}>{assessment}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
