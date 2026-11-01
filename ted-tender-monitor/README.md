# steadfetch/ted-tender-monitor — examples

Monitor EU procurement notices (TED) and US federal contract awards
(USAspending) as JSON. Delta-only: each run delivers only rows it has
never delivered before.

Store: https://apify.com/steadfetch/ted-tender-monitor

## Files

- `api-call.sh` — plain REST call (run-sync endpoint), no SDK.
- `example.js` — `apify-client` for Node.js.
- `example.py` — `apify-client` for Python.
- `sample-output.json` — real sample row (from the Actor's documented fixture).
- `n8n-workflow.json` — n8n template: daily rows into Google Sheets.
- `make-guide.md` — step-by-step Make guide.

## Quick start

Get a free API token at https://console.apify.com/settings/integrations,
then export it: `export APIFY_TOKEN=...`

Example: software tenders from Spanish buyers, EUR 100k+:

    source: "ted"
    queries: [{ "text": "software", "countries": ["ES"], "minValueEur": 100000 }]
    maxResults: 50
    monitorMode: true

See the Actor page for the full input schema (cpv, agencies, naics, ...)
and pricing ($4.00 per 1,000 new rows; 0 new rows = 0 result charges).

## No-code

**Use case:** follow newly published EU tenders for your keywords every morning into Google Sheets: buyer organisation, title, publication and deadline dates, CPV codes, notice link and estimated value with currency, so nobody misses a bid deadline.

### n8n — daily rows into Google Sheets

1. Download [`n8n-workflow.json`](./n8n-workflow.json) and import it in n8n: **Workflow menu → Import from File**.
2. Create a **Header Auth** credential named `Apify API token`: header name `Authorization`, value `Bearer <your token>` (copy the token from <https://console.apify.com/account/integrations>). Select it in the **Run the Actor** node. The token stays in your n8n credential — it is not in this repository.
3. In **Append rows to Google Sheet**, paste your spreadsheet URL (share the sheet with the account n8n uses) and the tab name, and pick your Google Sheets credential.
4. Open **Run the Actor** and adjust the input body — `queries` is the list of free-text searches (keyword or CPV description); `maxResults` caps the batch.
5. Activate the workflow. It runs daily at 07:00 (change the schedule on the first node) and appends one row per result, mapped automatically from the JSON fields.

### Make — step by step

1. In Make, create a new scenario and add **Schedule** (e.g. daily at 07:00).
2. Add **HTTP → Make a request**: `POST https://api.apify.com/v2/acts/steadfetch~ted-tender-monitor/run-sync-get-dataset-items`, body type `Raw` / JSON, header `Authorization: Bearer <your Apify token>` (paste your own token here; it stays in your Make scenario), body = the input JSON from the README. Enable *Parse response*.
3. Add **Google Sheets → Add a Row**, pick your spreadsheet and sheet, and map the fields you want from step 2 (each result is one row).
4. Run once with **Run once** to verify the mapping, then activate the scenario.

The Apify token is a credential **you** paste into your own Make scenario; no token is stored in this repository.

Detailed Make instructions for this Actor: [`make-guide.md`](./make-guide.md).

Built by [Steadfetch](https://apify.com/steadfetch) — *web data that doesn't break*.
