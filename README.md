# PolyQuant Portfolio Demo

This repository is a sanitized Lovable-ready demo of the private PolyQuant dashboard.
It preserves the visual product surface of the real frontend while replacing every
backend call, auth flow, and runtime integration with static mock data.

## What Is Included

- The real React dashboard shell and dashboard components.
- Mocked portfolio, opportunities, positions, analytics, risk, timeline, and smart-money views.
- A Vite + React + TypeScript setup that runs without API keys.

## What Is Not Included

- The private Python backend.
- Probability engines, execution daemons, settlement workers, notebooks, trade ledgers, logs, or market-data captures.
- Supabase auth/config, Telegram integrations, API keys, or production environment files.
- Proprietary sizing, routing, calibration, or trading logic.

## Run Locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Use In Lovable

Import this GitHub repository directly:

```text
https://github.com/yokomizo1/PolyQuant-Portfolio
```

Lovable prompt:

```text
Use this repository as a sanitized demo of the PolyQuant dashboard. Keep the
current visual structure and mock-data behavior. Do not add real authentication,
API keys, trading execution, settlement logic, or backend integrations. Improve
only the public demo UX, copy, responsiveness, and presentation polish.
```

## License

All rights reserved. This repository is for portfolio review and demo purposes only.
