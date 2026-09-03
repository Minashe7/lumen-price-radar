# Lumen Price Radar

Egypt-focused price radar for games first, then software and apps.

## Current architecture

`CheapShark → Vercel Data Engine → cached normalized JSON → Lumen UI`

The browser should not depend directly on CheapShark for the main feed. Server-side API routes normalize the data and use cache headers. A cron route warms the feed every 15 minutes.

## Data Engine

- `/api/deals` — normalized live deal feed
- `/api/search?title=` — game search
- `/api/game?id=` — game details and offers
- `/api/cron` — cache warmer

## Rules

- Do not scrape GG.deals.
- Do not fabricate affiliate parameters.
- CheapShark data is USD; Lumen converts for display to EGP as an estimate.
- PC/game coverage comes first. Other platforms require permitted data sources before being advertised as live.

## Roadmap

1. Stabilize the data engine and cache.
2. Move the Lumen V6 UX onto the server-side data layer.
3. Add game details, search, filters and store links.
4. Add wishlist/account sync.
5. Add real price alerts and history.
6. Add approved affiliate links.
7. Expand the software/apps radar.
8. Add SEO, PWA, monitoring and production tests.
