# Companies House Monitor — examples

> Apify Store title: **UK Companies House Scraper (Risk, Charges & Filings)**

Run [`steadfetch/companies-house-monitor`](https://apify.com/steadfetch/companies-house-monitor) from
the Apify API or from JavaScript and Python, and get **delta events** for the UK companies you
watch: new matches, register status moves, accounts-overdue flags, insolvency, charges and risk
filings. You keep a private watchlist; every run returns only what changed.

- Store: <https://apify.com/steadfetch/companies-house-monitor>
- Source data: [Companies House](https://developer.company-information.service.gov.uk/) (Open
  Government Licence v3.0), company-level fields only — no officers, no PSCs, no personal data.
- Pricing: 4.00 USD per 1,000 delta events (0.004 USD per event), plus 0.05 USD per 1,000
  monitor-checks (one per evaluated watch per run, even when nothing changed), plus run-start
  compute billed per GB of memory (~0.0002 USD at the default 4 GB). `manage` runs push nothing and
  bill neither.

## Prerequisites

- An Apify account and token (<https://console.apify.com/account/integrations>). A free tier works.
- `APIFY_TOKEN` in your environment for every example below.
- No Companies House key needed: the Actor uses one internally. Pass your own free Companies House
  key through the optional `apiKey` input to get the full 600-calls-per-5-minutes budget for
  yourself instead of sharing the publisher's key.

## How the watchlist works

1. Add targets once in `manage` mode. Management runs fetch no data and push nothing, so they don't
   bill a result:

   ```json
   {
     "mode": "manage",
     "manage": {
       "action": "add",
       "targets": [
         { "type": "company", "company_number": "08209948" },
         { "type": "query", "query": "renewable", "since": "2026-01-01" }
       ]
     }
   }
   ```

   A `company` target watches one register record. A `query` target is a saved search: every newly
   incorporated company that matches it becomes a `new_match`.

2. Schedule `mode: "watch"` daily. The first watch run delivers a baseline; later runs deliver only
   changes. An unchanged watch returns 0 events and bills one monitor-check, no events.

3. One-off snapshot: `"monitorMode": false` delivers the current state of every stored watch as
   `new_match` without updating the watchlist or billing checks.

## 1. API call (curl)

```bash
./api-call.sh add        # one-time: add a company watch + a saved search (bills nothing)
./api-call.sh watch      # daily: deliver only what changed
./api-call.sh snapshot   # one-off: backfill every stored watch, no check charges
```

## 2. JavaScript (Node.js)

```bash
npm install apify-client
APIFY_TOKEN=... node example.js
```

## 3. Python

```bash
pip install apify-client
APIFY_TOKEN=... python example.py
```

## Sample output

`output.example.json` is the published example event from the Actor's Store README (fetched
2026-11-01). One dataset item per delta event; every item is validated against the published
dataset schema (`strictSchema` defaults to `true`).

```json
{
  "event_type": "risk_indicator",
  "watch_id": "wl_08209948",
  "company_number": "08209948",
  "company_name": "! LTD",
  "company_status": "active",
  "previous_status": "active",
  "detected_at": "2026-10-26T07:30:00.000Z",
  "changed_fields": ["insolvency"],
  "source_url": "https://find-and-update.company-information.service.gov.uk/company/08209948",
  "licence": "OGL v3",
  "risk_sub_type": "insolvency",
  "risk_description": "New insolvency case detected (status: active)",
  "record": { "...": "current company record" }
}
```

Event types: `new_match` (first delivery for a watch), `status_changed`, `accounts_overdue_changed`
and `risk_indicator` (with `risk_sub_type`: `insolvency`, `charge`, `filing_ds01`,
`filing_address_change`, `filing_accounts_overdue`). Every event carries `source_url` for
verification and `licence: "OGL v3"`.

## Input reference

| Field | Type | Description |
|---|---|---|
| `mode` | `watch` \| `manage` | Required. `watch` evaluates your watchlist and delivers delta events; `manage` edits the watchlist and pushes nothing. |
| `manage` | object | When `mode=manage`: `action` (`add`, `remove` or `list`) and `targets` (company or query targets). |
| `maxResults` | integer | Default 100, maximum 5000. Changes beyond the cap stay pending for the next run. |
| `monitorMode` | boolean | Default `true`. `false` = one-off backfill of every stored watch, no check charges. |
| `apiKey` | string | Optional own free Companies House key (600 calls per 5 minutes per key). |
| `strictSchema` | boolean | Default `true`; fail the run when an event does not match the output schema. |

## No-code

**Use case:** watch new UK companies in your sector every morning into Google Sheets: one row per
delta event, so a sales or compliance team starts the day with the latest new incorporations and
risk signals instead of re-checking the register by hand. Only changes arrive — no repeats.

### n8n — daily delta events into Google Sheets

1. Add your targets once: run `./api-call.sh add` (or the manage call from the README) with your
   own query target — that saved search is what the daily run watches.
2. Download [`n8n-workflow.json`](./n8n-workflow.json) and import it in n8n: **Workflow menu →
   Import from File**.
3. Create a **Header Auth** credential named `Apify API token`: header name `Authorization`, value
   `Bearer <your token>` (copy the token from <https://console.apify.com/account/integrations>).
   Select it in the **Run the Actor** node. The token stays in your n8n credential — it is not in
   this repository.
4. In **Append rows to Google Sheet**, paste your spreadsheet URL (share the sheet with the account
   n8n uses) and the tab name, and pick your Google Sheets credential.
5. Activate the workflow. It runs daily at 07:00 (change the schedule on the first node), calls the
   Actor in `watch` mode and appends one row per delta event, mapped automatically from the JSON
   fields.

### Make — step by step

1. In Make, create a new scenario and add **Schedule** (e.g. daily at 07:00).
2. Add **HTTP → Make a request**: `POST https://api.apify.com/v2/acts/steadfetch~companies-house-monitor/run-sync-get-dataset-items`, body type `Raw` / JSON, header `Authorization: Bearer <your Apify token>` (paste your own token here; it stays in your Make scenario), body = the watch input JSON from the README. Enable *Parse response*.
3. Add **Google Sheets → Add a Row**, pick your spreadsheet and sheet, and map the fields you want from step 2 (each delta event is one row).
4. Run once with **Run once** to verify the mapping, then activate the scenario.

The Apify token is a credential **you** paste into your own Make scenario; no token is stored in this repository.

Detailed Make instructions for this Actor: [`make-guide.md`](./make-guide.md).

Built by [Steadfetch](https://apify.com/steadfetch) — *web data that doesn't break*.
