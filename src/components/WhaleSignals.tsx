import { useWhaleSignals } from "@/hooks/useBackendData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp, TrendingDown, Waves, RefreshCw } from "lucide-react";

const fmt = (n: number) => (n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n.toFixed(0)}`);
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

export default function WhaleSignals() {
  const { data, isLoading, error } = useWhaleSignals();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-12 justify-center">
        <RefreshCw className="h-5 w-5 animate-spin" />
        Scanning smart money activity...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 text-center py-8">Failed to load whale signals</div>;
  }

  const signals = data?.signals ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Waves className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold">Smart Money Scanner</h2>
          <Badge variant="outline" className="text-xs">
            {signals.length} signal{signals.length !== 1 ? "s" : ""}
          </Badge>
        </div>
        {data?.scanned_at && (
          <span className="text-xs text-muted-foreground">
            Scanned: {new Date(data.scanned_at).toLocaleTimeString()}
          </span>
        )}
      </div>

      {signals.length === 0 ? (
        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="py-8 text-center text-muted-foreground">
            No whale activity detected right now. The scanner checks for high-volume markets
            with significant price moves and directional orderbook imbalance.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {signals.map((s) => (
            <Card key={s.market_id} className="bg-slate-900/50 border-slate-800 hover:border-slate-600 transition-colors">
              <CardContent className="py-4 px-5">
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Question + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {s.polymarket_url ? (
                        <a
                          href={s.polymarket_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-300 hover:text-blue-200 hover:underline truncate"
                          title={s.question}
                        >
                          {s.question}
                          <ExternalLink className="inline h-3 w-3 ml-1 opacity-60" />
                        </a>
                      ) : (
                        <span className="text-sm font-medium truncate" title={s.question}>{s.question}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs">
                      <Badge
                        variant="outline"
                        className={s.signal_side === "YES"
                          ? "border-green-500/40 text-green-400"
                          : "border-red-500/40 text-red-400"
                        }
                      >
                        {s.signal_side === "YES" ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {s.signal_side}
                      </Badge>
                      <span className="text-muted-foreground">
                        Vol: {fmt(s.volume_24h)} · Liq: {fmt(s.liquidity)}
                      </span>
                      <span className={s.price_change_1d > 0 ? "text-green-400" : "text-red-400"}>
                        Δ{pct(s.price_change_1d)}
                      </span>
                      <span className="text-muted-foreground">
                        CLOB: {s.clob_large_orders} lg orders · Imb: {pct(s.clob_imbalance)}
                      </span>
                      {s.days_out > 0 && (
                        <span className="text-muted-foreground">{s.days_out.toFixed(0)}d to resolve</span>
                      )}
                    </div>
                  </div>

                  {/* Right: Score + Price */}
                  <div className="text-right flex-shrink-0">
                    <div className={`text-lg font-bold ${s.smart_money_score >= 10 ? "text-yellow-400" : s.smart_money_score >= 5 ? "text-blue-400" : "text-slate-300"}`}>
                      {s.smart_money_score.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">score</div>
                    <div className="mt-1 text-xs">
                      <span className="text-green-400">{(s.yes_price * 100).toFixed(0)}¢</span>
                      <span className="text-muted-foreground mx-1">/</span>
                      <span className="text-red-400">{(s.no_price * 100).toFixed(0)}¢</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-slate-900/30 border-slate-800">
        <CardContent className="py-3 px-4">
          <p className="text-xs text-muted-foreground">
            <strong>How it works:</strong> Detects markets with unusually high volume ($50k+), significant price moves (8%+),
            and directional CLOB orderbook imbalance. Anti-farming filters exclude ADR/EARN noise (symmetric books, 50/50 prices).
            Higher score = stronger conviction signal. The bot uses these signals with AI confluence for automated copy-trades.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
