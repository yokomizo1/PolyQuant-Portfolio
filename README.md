# PolyQuant Portfolio Demo

PolyQuant is a private quantitative research and paper-trading platform for prediction markets. This public repository is a sanitized portfolio demo: it shows the product experience, information architecture, and dashboard design without publishing the proprietary trading engines, execution logic, calibration code, production data, or private integrations.

## What This Demo Shows

- A React dashboard for monitoring a multi-engine market research system.
- Mock portfolio KPIs, signal quality metrics, equity curves, active positions, and event timelines.
- Product-level architecture and UX direction for a trading research platform.
- A clean frontend implementation that can be reviewed without requiring API keys or private backend services.

## What Is Not Included

- Proprietary probability engines, strategy gates, risk sizing, or execution logic.
- Backend Python services, daemons, settlement workers, notebooks, trade ledgers, or market-data captures.
- API keys, Supabase configuration, Telegram integrations, or real account/runtime state.

## Tech Stack

- React + TypeScript
- Vite
- Recharts
- Lucide icons
- CSS modules via plain CSS custom properties

## Local Development

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Commercial Note

This is a public demo only. The production PolyQuant system remains private and is not licensed for use, copying, deployment, or resale.
