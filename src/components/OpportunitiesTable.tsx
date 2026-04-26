import { useState, useEffect, useRef } from "react";
import { Zap, Loader2, Wifi, HelpCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOpportunities, type Opportunity, executeTrade } from "@/hooks/useBackendData";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";

const categoryColors: Record<string, string> = {
  Sports: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Politics: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Crypto: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Esports: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

type FlashDirection = "up" | "down";

const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;
const buildCellKey = (id: string, field: "odds" | "trueProb") => `${id}:${field}`;

const columnTooltips: Record<string, string> = {
  "True Prob.": "Our model's estimated true probability — Platt-calibrated, not guessed.",
  "EV": "Expected Value — the % edge over market price. Higher = stronger signal.",
  "Stake (Kelly)": "Optimal bet size via Half-Kelly Criterion, capped at 5% of bankroll.",
  "Engine": "Which engine produced this signal: binance (vol arb), ai_model (base rate), whale (smart money).",
};

const OpportunitiesTable = () => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [flashCells, setFlashCells] = useState<Record<string, FlashDirection>>({});
  const prevOddsRef = useRef<Record<string, number>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: signals, isLoading, isError, dataUpdatedAt } = useOpportunities();

  // Detect odds changes and trigger flash animations
  useEffect(() => {
    if (!signals) return;

    const prev = prevOddsRef.current;
    const flashes: Record<string, FlashDirection> = {};
    const nextValues: Record<string, number> = {};

    signals.forEach((s) => {
      const displayedOdds = Number((s.odds * 100).toFixed(1));
      const displayedTrueProb = Number((s.trueProb * 100).toFixed(1));
      const oddsKey = buildCellKey(s.id, "odds");
      const trueProbKey = buildCellKey(s.id, "trueProb");

      if (prev[oddsKey] !== undefined && prev[oddsKey] !== displayedOdds) {
        flashes[oddsKey] = displayedOdds > prev[oddsKey] ? "up" : "down";
      }

      if (prev[trueProbKey] !== undefined && prev[trueProbKey] !== displayedTrueProb) {
        flashes[trueProbKey] = displayedTrueProb > prev[trueProbKey] ? "up" : "down";
      }

      nextValues[oddsKey] = displayedOdds;
      nextValues[trueProbKey] = displayedTrueProb;
    });

    prevOddsRef.current = nextValues;

    if (Object.keys(flashes).length > 0) {
      setFlashCells(flashes);
      const timer = setTimeout(() => setFlashCells({}), 1400);
      return () => clearTimeout(timer);
    }
  }, [signals, dataUpdatedAt]);

  const handleExecute = async (signal: Opportunity) => {
    setLoadingId(signal.id);
    try {
      const result = await executeTrade(signal);
      if (result.success) {
        toast({ title: "Trade Executed", description: `${signal.event} — $${signal.stake} ${signal.side ?? "YES"}` });
        // Refresh portfolio and positions after trade
        queryClient.invalidateQueries({ queryKey: ["portfolio"] });
        queryClient.invalidateQueries({ queryKey: ["open-positions"] });
        queryClient.invalidateQueries({ queryKey: ["equity-history"] });
      } else {
        toast({ title: "Trade Rejected", description: result.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to execute trade", variant: "destructive" });
    } finally {
      setLoadingId(null);
    }
  };

  const getFlashClass = (id: string, field: "odds" | "trueProb") => {
    const flash = flashCells[buildCellKey(id, field)];
    if (!flash) return "";
    return flash === "up"
      ? "bg-primary/30 text-primary-foreground ring-1 ring-primary/70 scale-[1.05]"
      : "bg-destructive/25 text-destructive-foreground ring-1 ring-destructive/70 scale-[1.05]";
  };

  return (
    <div className="card-shine rounded-lg border border-border p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-mono uppercase tracking-widest text-muted-foreground">Live Opportunities</h2>
          <p className="text-xs text-muted-foreground mt-1">AI-detected positive EV signals</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
            <span className="text-xs font-mono text-primary">Live Data</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-mono text-muted-foreground">
              {signals?.length ?? 0} signals
            </span>
          </div>
        </div>
      </div>

      {isError && (
        <div className="text-center py-8">
          <Wifi className="w-6 h-6 text-destructive mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Connection issue. Auto-retrying...</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Event", "Category", "Side", "Market Odds", "True Prob.", "EV", "Stake (Kelly)", "Engine", "Action"].map((heading) => (
                <th key={heading} className="text-left py-3 px-3 text-xs font-mono uppercase tracking-widest text-muted-foreground font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    {heading}
                    {columnTooltips[heading] && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3 h-3 text-muted-foreground/50 cursor-help hover:text-primary transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[240px] bg-card border-border text-foreground text-xs font-sans normal-case tracking-normal">
                          {columnTooltips[heading]}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="py-3.5 px-3">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              : (signals ?? []).map((o) => (
                  <tr key={o.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="py-3.5 px-3 font-medium text-foreground max-w-[220px]">
                      {o.polymarket_url ? (
                        <a
                          href={o.polymarket_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="truncate block text-primary hover:text-primary/80 hover:underline transition-colors group"
                          title={o.event}
                        >
                          {o.event}
                          <ExternalLink className="w-3 h-3 inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        <span className="truncate block" title={o.event}>{o.event}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`text-xs font-mono px-2 py-1 rounded-full border ${categoryColors[o.category] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                        {o.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`text-xs font-mono font-semibold ${(o as any).side === "NO" ? "text-orange-400" : "text-primary"}`}>
                        {(o as any).side ?? "YES"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-muted-foreground">
                      <span
                        className={`inline-flex min-w-[5rem] items-center rounded-md px-2 py-1 transition-all duration-700 ease-out ${getFlashClass(o.id, "odds")}`}
                      >
                        {formatPercent(o.odds)}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-foreground">
                      <span
                        className={`inline-flex min-w-[5rem] items-center rounded-md px-2 py-1 transition-all duration-700 ease-out ${getFlashClass(o.id, "trueProb")}`}
                      >
                        {formatPercent(o.trueProb)}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-neon font-semibold">+{(o.ev * 100).toFixed(0)}%</td>
                    <td className="py-3.5 px-3 font-mono text-foreground">${o.stake}</td>
                    <td className="py-3.5 px-3">
                      <span className="text-xs font-mono text-muted-foreground">{(o as any).engine ?? "—"}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <Button
                        variant="neon"
                        size="sm"
                        className="text-xs h-7 px-3"
                        disabled={loadingId === o.id}
                        onClick={() => handleExecute(o)}
                      >
                        {loadingId === o.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Execute Trade"}
                      </Button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {dataUpdatedAt && (
        <p className="text-xs text-muted-foreground/50 font-mono mt-3 text-right">
          Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()} · Refreshing every 30s
        </p>
      )}
    </div>
  );
};

export default OpportunitiesTable;
