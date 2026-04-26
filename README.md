# PolyQuant

PolyQuant is a prediction-market intelligence dashboard for monitoring market signals, portfolio exposure, calibration quality, and research performance in one place.

Live preview: https://polyquantdemo.lovable.app

## Overview

The dashboard presents a clean operating view for a multi-engine quantitative research workflow:

- Portfolio KPIs, equity curve, and open exposure.
- Ranked opportunities with engine, side, probability, EV, and sizing context.
- Signal funnel, trade timeline, calibration heatmap, rejection log, and risk gauges.
- Smart-money/order-flow panel for market activity monitoring.

This public repository is a portfolio build of the interface. The production research engine, data pipelines, and operational services are not part of this repository.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Recharts

## Run Locally

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Repository Note

This project is published for product review and portfolio purposes. It focuses on the dashboard experience and public-facing presentation layer.

## License

All rights reserved.
