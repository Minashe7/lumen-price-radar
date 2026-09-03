# Lumen Price Radar

Egypt-focused price radar for games first, then software and apps.

## Current architecture

`CheapShark -> Vercel Data Engine -> cached normalized JSON -> Lumen UI`

The browser should not depend directly on CheapShark for the main feed. Server-side API routes normalize the data and use cache headers. A cron route warms the feed every 15 minutes and evaluates active price alerts.

## Data Engine

- `/api/deals` — normalized live deal feed
- `/api/search?title=` — game search
- `/api/game?id=` — game details and offers
- `/api/cron` — cache warmer + server-side price-alert evaluator

## Server environment variables

Configure these in the Vercel project settings, not in frontend code:

- `SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service-role key; server only, never expose it to the browser
- `CRON_SECRET` — optional secret used to protect the cron endpoint

The Supabase SQL in `supabase_schema.sql` creates the wishlist, price-alert, and alert-event tables. The alert checker records a trigger in `price_alerts` and `alert_events`; it does not claim to send email/SMS until a notification provider is configured.

## Rules

- Do not scrape GG.deals.
- Do not fabricate affiliate parameters.
- CheapShark data is USD; Lumen converts for display to EGP as an estimate.
- PC/game coverage comes first. Other platforms require permitted data sources before being advertised as live.

## Roadmap

1. Stabilize the data engine and cache. Done.
2. Move the Lumen V6 UX onto the server-side data layer. Done.
3. Add game details, search, filters and store links. Done.
4. Add wishlist/account sync. Foundation done.
5. Add real price alerts and history. Server-side alert evaluation is now implemented; notification delivery is next.
6. Add approved affiliate links.
7. Expand the software/apps radar.
8. Add SEO, PWA, monitoring and production tests.
