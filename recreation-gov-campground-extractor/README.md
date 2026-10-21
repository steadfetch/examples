# Recreation.gov Campground Scraper (Campsites & Amenities) — examples

> Apify Store title: **Recreation.gov Campground Scraper (Campsites & Amenities)**

Run [`steadfetch/recreation-gov-campground-extractor`](https://apify.com/steadfetch/recreation-gov-campground-extractor) and get the results as
JSON: one dataset item per campground, schema-validated by the Actor before it is stored.

- Store: <https://apify.com/steadfetch/recreation-gov-campground-extractor>
- Source data: public [Recreation.gov](https://www.recreation.gov/) campground pages (schema.org JSON-LD and published campsite inventory; facility metadata only, no reviewer identities).
- Pricing: 4.00 USD per 1,000 campgrounds, plus 0.00005 USD per run start.

## Prerequisites

- An Apify account and token (<https://console.apify.com/account/integrations>). A free tier works.
- The workflow in this folder calls the Actor through the Apify API
  (`POST /v2/acts/steadfetch~recreation-gov-campground-extractor/run-sync-get-dataset-items`), so the same token works for
  curl, JavaScript, Python and no-code tools.

## Example input

```json
{
  "campgroundIds": [
    "233462"
  ],
  "maxResults": 500,
  "includeCampsites": true
}
```

`campgroundIds` are the numeric Recreation.gov campground ids you watch; `includeCampsites: true` also returns the published campsite inventory.

## No-code

**Use case:** follow the campgrounds you are targeting for a trip or a reselling analysis: amenities, coordinates, published price and availability, and the campsite inventory into Google Sheets on a schedule.

### n8n — daily rows into Google Sheets

1. Download [`n8n-workflow.json`](./n8n-workflow.json) and import it in n8n: **Workflow menu → Import from File**.
2. Create a **Header Auth** credential named `Apify API token`: header name `Authorization`, value `Bearer <your token>` (copy the token from <https://console.apify.com/account/integrations>). Select it in the **Run the Actor** node. The token stays in your n8n credential — it is not in this repository.
3. In **Append rows to Google Sheet**, paste your spreadsheet URL (share the sheet with the account n8n uses) and the tab name, and pick your Google Sheets credential.
4. Open **Run the Actor** and adjust the input body — `campgroundIds` are the numeric Recreation.gov campground ids you watch; `includeCampsites: true` also returns the published campsite inventory.
5. Activate the workflow. It runs daily at 07:00 (change the schedule on the first node) and appends one row per result, mapped automatically from the JSON fields.

### Make — step by step

1. In Make, create a new scenario and add **Schedule** (e.g. daily at 07:00).
2. Add **HTTP → Make a request**: `POST https://api.apify.com/v2/acts/steadfetch~recreation-gov-campground-extractor/run-sync-get-dataset-items`, body type `Raw` / JSON, header `Authorization: Bearer <your Apify token>` (paste your own token here; it stays in your Make scenario), body = the input JSON from the README. Enable *Parse response*.
3. Add **Google Sheets → Add a Row**, pick your spreadsheet and sheet, and map the fields you want from step 2 (each result is one row).
4. Run once with **Run once** to verify the mapping, then activate the scenario.

The Apify token is a credential **you** paste into your own Make scenario; no token is stored in this repository.

Detailed Make instructions for this Actor: [`make-guide.md`](./make-guide.md).

Built by [Steadfetch](https://apify.com/steadfetch) — *web data that doesn't break*.
