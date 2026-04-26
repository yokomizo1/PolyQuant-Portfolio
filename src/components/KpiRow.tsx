import { TrendingUp, Target, DollarSign, Cpu, Wallet, BarChart3 } from "lucide-react";
import { usePortfolio } from "@/hooks/useBackendData";
import { Skeleton } from "@/components/ui/skeleton";

interface KpiCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: boolean;
  sub?: string;
}

const KpiCard = ({ label, value, icon, accent, sub }: KpiCardProps) => (
  <div className="card-shine rounded-lg border border-border p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="text-muted-foreground">{icon}</div>
    </div>
    <span className={`text-2xl font-bold font-mono tracking-tight ${accent ? "text-neon" : "text-foreground"}`}>
      {value}
    </span>
    {sub && <span className="text-[10px] font-mono text-muted-foreground/60">{sub}</span>}
  </div>
);

const KpiRow = () => {
  const { data, isLoading } = usePortfolio();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card-shine rounded-lg border border-border p-5 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-20" />
          </div>
        ))}
      </div>
    );
  }

  const kpis: KpiCardProps[] = [
    {
      label: "Bankroll",
      value: `$${data.bankroll.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: <Wallet className="w-4 h-4" />,
      accent: data.bankroll >= data.starting_bankroll,
      sub: `Equity: $${data.equity.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
    },
    {
      label: "ROI",
      value: `${data.roi_pct >= 0 ? "+" : ""}${data.roi_pct.toFixed(1)}%`,
      icon: <TrendingUp className="w-4 h-4" />,
      accent: data.roi_pct > 0,
      sub: `Started $${data.starting_bankroll.toLocaleString()}`,
    },
    {
      label: "Win Rate",
      value: `${data.win_rate.toFixed(1)}%`,
      icon: <Target className="w-4 h-4" />,
      sub: `${data.wins}W / ${data.losses}L (${data.n_resolved} trades)`,
    },
    {
      label: "P&L / Open",
      value: `${data.total_pnl >= 0 ? "+" : ""}$${data.total_pnl.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: <BarChart3 className="w-4 h-4" />,
      accent: data.total_pnl > 0,
      sub: `${data.open_count} positions · $${data.open_exposure.toFixed(0)} exposed`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.label} {...kpi} />
      ))}
    </div>
  );
};

export default KpiRow;
