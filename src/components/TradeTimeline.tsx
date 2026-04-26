import { useState } from "react";
import { useTradeHistory, type TradeHistoryFilters } from "@/hooks/useBackendData";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, History } from "lucide-react";

const RESULT_PILLS = ["ALL", "WIN", "LOSS", "OPEN"] as const;
const STATUS_PILLS = ["ALL", "FILLED", "REJECTED", "EARLY_EXIT"] as const;

function formatTs(ts: string): string {
  try {
    return new Date(ts).toLocaleString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false,
    });
  } catch {
    return ts;
  }
}

function ResultBadge({ result }: { result: string }) {
  const cfg: Record<string, string> = {
    WIN: "bg-green-500/15 text-green-400",
    LOSS: "bg-red-500/15 text-red-400",
    OPEN: "bg-blue-500/15 text-blue-400",
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold ${cfg[result] ?? "bg-secondary/20 text-muted-foreground"}`}>
      {result}
    </span>
  );
}

function PnlCell({ pnl }: { pnl: number | null }) {
  if (pnl === null) return <span className="text-muted-foreground font-mono text-xs">—</span>;
  const color = pnl > 0 ? "text-green-400" : "text-red-400";
  const sign = pnl > 0 ? "+" : "-";
  return <span className={`font-mono text-xs ${color}`}>{sign}${Math.abs(pnl).toFixed(2)}</span>;
}

function PillGroup<T extends string>({
  options, value, onChange,
}: { options: readonly T[]; value: string; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-colors ${
            value === opt
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function TradeTimeline() {
  const [filters, setFilters] = useState<TradeHistoryFilters>({
    result: "ALL", status: "ALL", category: "ALL", engine: "ALL",
  });
  const [page, setPage] = useState(1);

  const setFilter = (key: keyof TradeHistoryFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const { data, isLoading, isError } = useTradeHistory(filters, page);

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <History className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-mono font-medium text-muted-foreground">Trade History</h3>
        {data && (
          <span className="ml-auto text-xs font-mono text-muted-foreground">
            {data.total.toLocaleString()} trades
          </span>
        )}
      </div>

      {/* Summary bar */}
      {data && (
        <div className="flex gap-4 flex-wrap text-xs font-mono">
          <span className="text-green-400">{data.summary.wins}W</span>
          <span className="text-red-400">{data.summary.losses}L</span>
          <span className={data.summary.total_pnl >= 0 ? "text-green-400" : "text-red-400"}>
            PnL {data.summary.total_pnl >= 0 ? "+" : "-"}${Math.abs(data.summary.total_pnl).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-muted-foreground">staked ${data.summary.total_staked.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] font-mono text-muted-foreground w-12">Result</span>
          <PillGroup options={RESULT_PILLS} value={filters.result ?? "ALL"} onChange={(v) => setFilter("result", v)} />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[10px] font-mono text-muted-foreground w-12">Status</span>
          <PillGroup options={STATUS_PILLS} value={filters.status ?? "ALL"} onChange={(v) => setFilter("status", v)} />
        </div>
        {data && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-mono text-muted-foreground w-12">Category</span>
            <select
              value={filters.category ?? "ALL"}
              onChange={(e) => setFilter("category", e.target.value)}
              className="bg-background border border-border rounded px-2 py-0.5 text-xs font-mono text-foreground"
            >
              <option value="ALL">All</option>
              {data.available_categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span className="text-[10px] font-mono text-muted-foreground">Engine</span>
            <select
              value={filters.engine ?? "ALL"}
              onChange={(e) => setFilter("engine", e.target.value)}
              className="bg-background border border-border rounded px-2 py-0.5 text-xs font-mono text-foreground"
            >
              <option value="ALL">All</option>
              {data.available_engines.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      {isLoading && <Skeleton className="h-64 w-full rounded-xl" />}
      {isError && <p className="text-xs font-mono text-red-400">Failed to load trade history.</p>}
      {data && data.items.length === 0 && (
        <p className="text-xs font-mono text-muted-foreground">No trades match the selected filters.</p>
      )}
      {data && data.items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-[10px]">
                <th className="text-left pb-2 pr-3 w-28">Date</th>
                <th className="text-left pb-2 pr-3">Market</th>
                <th className="text-left pb-2 pr-3 w-20">Category</th>
                <th className="text-left pb-2 pr-3 w-20">Engine</th>
                <th className="text-center pb-2 pr-3 w-10">Side</th>
                <th className="text-center pb-2 pr-3 w-16">Result</th>
                <th className="text-right pb-2 pr-3 w-16">Stake</th>
                <th className="text-right pb-2 pr-3 w-12">EV</th>
                <th className="text-right pb-2 w-16">PnL</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, i) => (
                <tr
                  key={`${item.timestamp}-${i}`}
                  className="border-b border-border/40 hover:bg-secondary/20 transition-colors"
                >
                  <td className="py-1.5 pr-3 text-muted-foreground text-[10px]">{formatTs(item.timestamp)}</td>
                  <td className="py-1.5 pr-3 max-w-xs">
                    <span className="truncate block" title={item.market}>{item.market}</span>
                  </td>
                  <td className="py-1.5 pr-3 text-muted-foreground capitalize">{item.category}</td>
                  <td className="py-1.5 pr-3 text-muted-foreground">{item.engine}</td>
                  <td className="py-1.5 pr-3 text-center">
                    <span className={item.side === "YES" ? "text-green-400" : "text-red-400"}>{item.side}</span>
                  </td>
                  <td className="py-1.5 pr-3 text-center"><ResultBadge result={item.result} /></td>
                  <td className="py-1.5 pr-3 text-right text-muted-foreground">${item.stake.toFixed(2)}</td>
                  <td className="py-1.5 pr-3 text-right text-muted-foreground">
                    {item.ev !== 0 ? `${(item.ev * 100).toFixed(0)}%` : "—"}
                  </td>
                  <td className="py-1.5 text-right"><PnlCell pnl={item.pnl} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {data && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1 rounded border border-border disabled:opacity-30 hover:bg-secondary/40 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-muted-foreground">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1 rounded border border-border disabled:opacity-30 hover:bg-secondary/40 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
