# Recreation.gov Campground Scraper (Campsites & Amenities) — Make (step by step)

Run [`steadfetch/recreation-gov-campground-extractor`](https://apify.com/steadfetch/recreation-gov-campground-extractor) from a Make scenario and
land every result in a Google Sheet.

**Use case:** follow the campgrounds you are targeting for a trip or a reselling analysis: amenities, coordinates, published price and availability, and the campsite inventory into Google Sheets on a schedule.

> **Why steps instead of a `make-scenario.json`:** Make only exports a scenario *blueprint* from
> inside a Make account, so we would be shipping a file nobody here has imported. The four steps
> below build the same scenario in about three minutes; once you have it working you can export your
> own blueprint from Make and share it.

## Steps

1. In Make, create a new scenario and add **Schedule** (e.g. daily at 07:00).
2. Add **HTTP → Make a request**: `POST https://api.apify.com/v2/acts/steadfetch~recreation-gov-campground-extractor/run-sync-get-dataset-items`, body type `Raw` / JSON, header `Authorization: Bearer <your Apify token>` (paste your own token here; it stays in your Make scenario), body = the input JSON from the README. Enable *Parse response*.
3. Add **Google Sheets → Add a Row**, pick your spreadsheet and sheet, and map the fields you want from step 2 (each result is one row).
4. Run once with **Run once** to verify the mapping, then activate the scenario.

The Apify token is a credential **you** paste into your own Make scenario; no token is stored in this repository.

## Input (paste as the HTTP body)

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

## Notes

- `run-sync-get-dataset-items` returns when the run finishes (up to 300 seconds); set the HTTP module
  timeout accordingly.
- Each run appends a fresh batch of rows. Where the Actor documents a monitor/deduplication mode,
  turn it on so only new records arrive; otherwise add a **Router + filter** on a stable identifier
  before the Google Sheets module if you do not want repeats.
- Pricing: 4.00 USD per 1,000 campgrounds, plus 0.00005 USD per run start (source: the Actor's Store listing).
- Full input and output reference: the [Store listing](https://apify.com/steadfetch/recreation-gov-campground-extractor).

Built by [Steadfetch](https://apify.com/steadfetch) — *web data that doesn't break*.
