import { useAnalytics, type RejectionEntry } from "@/hooks/useBackendData";
import { Skeleton } from "@/components/ui/skeleton";
import { XCircle } from "lucide-react";

function formatTs(ts: string): string {
  try {
    const d = new Date(ts);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return ts;
  }
}

export default function RejectionLog() {
  const { data, isLoading, isError } = useAnalytics();

  if (isLoading) return <Skeleton className="h-64 w-full rounded-xl" />;
  if (isError || !data) return null;

  const { rejection_log } = data;
  if (!rejection_log.length) return null;

  // Group by reason for summary
  const reasonCounts: Record<string, number> = {};
  rejection_log.forEach((r) => {
    reasonCounts[r.reason] = (reasonCounts[r.reason] || 0) + 1;
  });
  const topReasons = Object.entries(reasonCounts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <XCircle className="w-4 h-4 text-red-400" />
        <h3 className="text-sm font-mono font-medium text-muted-foreground">
          Rejection Log — last 50
        </h3>
      </div>

      {/* Reason summary pills */}
      <div className="flex flex-wrap gap-2 mb-3">
        {topReasons.map(([reason, count]) => (
          <span
            key={reason}
            className="text-[10px] font-mono bg-red-400/10 text-red-400 px-2 py-0.5 rounded-full"
          >
            {reason}: {count}
          </span>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-64 overflow-y-auto">
        <table className="w-full text-xs font-mono">
          <thead className="sticky top-0 bg-card">
            <tr className="text-muted-foreground border-b border-border">
              <th className="text-left py-1 px-2">Time</th>
              <th className="text-left py-1 px-2">Engine</th>
              <th className="text-left py-1 px-2">Market</th>
              <th className="text-right py-1 px-2">Stake</th>
              <th className="text-right py-1 px-2">EV</th>
              <th className="text-left py-1 px-2">Reason</th>
            </tr>
          </thead>
          <tbody>
            {rejection_log.map((r: RejectionEntry, i: number) => (
              <tr
                key={`${r.timestamp}-${i}`}
                className="border-b border-border/30 hover:bg-secondary/20"
              >
                <td className="py-1 px-2 text-muted-foreground whitespace-nowrap">
                  {formatTs(r.timestamp)}
                </td>
                <td className="py-1 px-2">{r.engine}</td>
                <td className="py-1 px-2 truncate max-w-40" title={r.market}>
                  {r.market}
                </td>
                <td className="py-1 px-2 text-right">${r.stake}</td>
                <td className="py-1 px-2 text-right">{(r.ev * 100).toFixed(1)}%</td>
                <td className="py-1 px-2 text-red-400/80">{r.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
