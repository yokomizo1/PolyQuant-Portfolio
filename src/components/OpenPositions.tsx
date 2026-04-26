import { Clock, TrendingUp, TrendingDown, Loader2, ExternalLink } from "lucide-react";
import { useOpenPositions } from "@/hooks/useBackendData";
import { Skeleton } from "@/components/ui/skeleton";

const categoryColors: Record<string, string> = {
  crypto: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  esports: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  sports: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  politics: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  general: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const engineIcons: Record<string, string> = {
  binance: "💹",
  ai_model: "🤖",
  base_rate: "📊",
  whale: "🐋",
  pinnacle: "🎯",
};

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 0) return "just now";
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const OpenPositions = () => {
  const { data: positions, isLoading, isError } = useOpenPositions();

  const totalExposure = positions?.reduce((sum, p) => sum + p.bet_size_usd, 0) ?? 0;

  return (
    <div className="card-shine rounded-lg border border-border p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
            Open Positions
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Active bets awaiting resolution
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground">
            {positions?.length ?? 0} bets · ${totalExposure.toFixed(0)} exposed
          </span>
        </div>
      </div>

      {isError && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">Failed to load positions. Retrying...</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Market", "Category", "Side", "Stake", "Entry", "Model P", "EV", "Engine", "Opened"].map((h) => (
                <th key={h} className="text-left py-3 px-3 text-xs font-mono uppercase tracking-widest text-muted-foreground font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="py-3.5 px-3"><Skeleton className="h-4 w-full" /></td>
                    ))}
                  </tr>
                ))
              : (positions ?? []).map((p) => (
                  <tr key={p.trade_id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="py-3.5 px-3 font-medium text-foreground max-w-[200px]">
                      {p.polymarket_url ? (
                        <a
                          href={p.polymarket_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate block text-primary hover:text-primary/80 hover:underline transition-colors group"
                          title={p.question}
                        >
                          {p.question.slice(0, 45)}{p.question.length > 45 ? "..." : ""}
                          <ExternalLink className="w-3 h-3 inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        <span className="truncate block" title={p.question}>{p.question.slice(0, 45)}{p.question.length > 45 ? "..." : ""}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`text-xs font-mono px-2 py-1 rounded-full border ${categoryColors[p.category] ?? categoryColors.general}`}>
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-mono font-semibold ${p.side === "YES" ? "text-primary" : "text-orange-400"}`}>
                        {p.side === "YES" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {p.side}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-foreground">${p.bet_size_usd.toFixed(2)}</td>
                    <td className="py-3.5 px-3 font-mono text-muted-foreground">{(p.entry_price * 100).toFixed(1)}¢</td>
                    <td className="py-3.5 px-3 font-mono text-foreground">{(p.model_prob * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-3 font-mono text-neon font-semibold">+{(p.expected_ev * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-3">
                      <span className="text-xs font-mono" title={p.engine_source}>
                        {engineIcons[p.engine_source] ?? "⚙️"} {p.engine_source}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-xs font-mono text-muted-foreground/60 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(p.opened_at)}
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpenPositions;
