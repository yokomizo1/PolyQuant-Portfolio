import {
  Activity,
  BarChart3,
  BrainCircuit,
  Lock,
  Radar,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { equityCurve, kpis, positions, signalMix, signals, timeline } from "./data/mockData";

const toneClass = {
  good: "good",
  warn: "warn",
  neutral: "neutral",
};

export function App() {
  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">PQ</div>
          <div>
            <strong>PolyQuant</strong>
            <span>Portfolio Demo</span>
          </div>
        </div>
        <nav>
          <a className="active"><Activity size={18} /> Overview</a>
          <a><Radar size={18} /> Signals</a>
          <a><ShieldCheck size={18} /> Risk</a>
          <a><BarChart3 size={18} /> Research</a>
        </nav>
        <div className="notice">
          <Lock size={18} />
          <p>Sanitized public demo. Production engines and execution code are private.</p>
        </div>
      </aside>

      <section className="content">
        <header className="hero">
          <div>
            <p className="eyebrow">Prediction market research platform</p>
            <h1>Quant dashboard for signal monitoring and simulated portfolio risk.</h1>
            <p>
              This public version uses mock data to demonstrate the product surface while protecting
              proprietary models, sizing logic, and live trading infrastructure.
            </p>
          </div>
          <div className="hero-metric">
            <BrainCircuit size={28} />
            <span>Model Stack</span>
            <strong>Private</strong>
          </div>
        </header>

        <section className="kpi-grid">
          {kpis.map((kpi) => (
            <article className="panel kpi" key={kpi.label}>
              <span>{kpi.label}</span>
              <strong>{kpi.value}</strong>
              <em className={toneClass[kpi.tone]}>{kpi.delta}</em>
            </article>
          ))}
        </section>

        <section className="dashboard-grid">
          <article className="panel chart-panel">
            <div className="panel-header">
              <div>
                <span>Simulated Equity</span>
                <strong>Research account curve</strong>
              </div>
              <TrendingUp size={20} />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={equityCurve}>
                <defs>
                  <linearGradient id="equity" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#223044" strokeDasharray="3 3" />
                <XAxis dataKey="day" stroke="#8da0ba" />
                <YAxis stroke="#8da0ba" width={58} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid #26364f" }} />
                <Area type="monotone" dataKey="equity" stroke="#22c55e" fill="url(#equity)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <span>Signal Funnel</span>
                <strong>Mock routing mix</strong>
              </div>
              <Activity size={20} />
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={signalMix}>
                <CartesianGrid stroke="#223044" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#8da0ba" />
                <YAxis stroke="#8da0ba" />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid #26364f" }} />
                <Bar dataKey="value" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </article>
        </section>

        <section className="table-grid">
          <article className="panel">
            <div className="panel-header">
              <div>
                <span>Recent Signals</span>
                <strong>Sanitized examples</strong>
              </div>
            </div>
            <div className="table">
              {signals.map((signal) => (
                <div className="row" key={signal.market}>
                  <div>
                    <strong>{signal.market}</strong>
                    <span>{signal.engine}</span>
                  </div>
                  <b className={`side ${signal.side.toLowerCase()}`}>{signal.side}</b>
                  <span>{signal.confidence}%</span>
                  <em>{signal.status}</em>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-header">
              <div>
                <span>Open Positions</span>
                <strong>Mock exposure</strong>
              </div>
            </div>
            <div className="table compact">
              {positions.map((position) => (
                <div className="row" key={position.market}>
                  <div>
                    <strong>{position.market}</strong>
                    <span>{position.category} · {position.age}</span>
                  </div>
                  <b className={`side ${position.side.toLowerCase()}`}>{position.side}</b>
                  <span>{position.exposure}</span>
                  <em>{position.mark}</em>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="panel timeline">
          <div className="panel-header">
            <div>
              <span>System Timeline</span>
              <strong>Demo events</strong>
            </div>
          </div>
          {timeline.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </section>
      </section>
    </main>
  );
}
