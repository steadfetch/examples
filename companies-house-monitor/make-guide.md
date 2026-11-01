# UK Companies House Scraper (Risk, Charges & Filings) — Make (step by step)

Run [`steadfetch/companies-house-monitor`](https://apify.com/steadfetch/companies-house-monitor) from a Make scenario and
land every delta event in a Google Sheet.

**Use case:** watch new UK companies in your sector every morning into Google Sheets: one row per
delta event (new incorporations, status moves, risk signals), so a sales or compliance team starts
the day with the latest changes instead of re-checking the register by hand. Only changes arrive —
no repeats.

> **Why steps instead of a `make-scenario.json`:** Make only exports a scenario *blueprint* from
> inside a Make account, so we would be shipping a file nobody here has imported. The steps
> below build the same scenario in about three minutes; once you have it working you can export
> your own blueprint from Make and share it.

## Steps

0. **One-time: add your watch targets.** Run `./api-call.sh add` (see the README) or the manage
   call from the Actor's README. A `query` target is a saved search: every newly incorporated
   company that matches it becomes a `new_match`.
1. In Make, create a new scenario and add **Schedule** (e.g. daily at 07:00).
2. Add **HTTP → Make a request**: `POST https://api.apify.com/v2/acts/steadfetch~companies-house-monitor/run-sync-get-dataset-items`, body type `Raw` / JSON, header `Authorization: Bearer <your Apify token>` (paste your own token here; it stays in your Make scenario), body = the watch input JSON from the README. Enable *Parse response*.
3. Add **Google Sheets → Add a Row**, pick your spreadsheet and sheet, and map the fields you want from step 2 (each delta event is one row).
4. Run once with **Run once** to verify the mapping, then activate the scenario.

The Apify token is a credential **you** paste into your own Make scenario; no token is stored in this repository.

## Input (paste as the HTTP body)

```json
{
  "mode": "watch",
  "monitorMode": true,
  "maxResults": 100
}
```

`mode: watch` evaluates your watchlist and delivers delta events: the first run delivers a
baseline, later runs deliver only what changed (0 events when nothing changed). For a one-off
snapshot of every stored watch, set `"monitorMode": false` — that backfill bills no monitor-checks.

## Notes

- `run-sync-get-dataset-items` returns when the run finishes (up to 300 seconds); set the HTTP module
  timeout accordingly.
- Deduplication is native: only new matches and watched-field changes are pushed, so no Router +
  filter is needed to avoid repeats.
- Pricing: 4.00 USD per 1,000 delta events, 0.05 USD per 1,000 monitor-checks, plus run-start
  compute billed per GB of memory (~0.0002 USD at the default 4 GB) (source: the Actor's Store listing).
- Full input and output reference: the [Store listing](https://apify.com/steadfetch/companies-house-monitor).

Built by [Steadfetch](https://apify.com/steadfetch) — *web data that doesn't break*.
