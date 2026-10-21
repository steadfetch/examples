# FDA Drug Labels Scraper (openFDA SPL Data) — Make (step by step)

Run [`steadfetch/openfda-drug-labels-extractor`](https://apify.com/steadfetch/openfda-drug-labels-extractor) from a Make scenario and
land every result in a Google Sheet.

**Use case:** keep a Google Sheet of the latest SPL label versions for the molecules you track, with effective date, labeler, indications and warnings text, refreshed after each openFDA update instead of by hand.

> **Why steps instead of a `make-scenario.json`:** Make only exports a scenario *blueprint* from
> inside a Make account, so we would be shipping a file nobody here has imported. The four steps
> below build the same scenario in about three minutes; once you have it working you can export your
> own blueprint from Make and share it.

## Steps

1. In Make, create a new scenario and add **Schedule** (e.g. daily at 07:00).
2. Add **HTTP → Make a request**: `POST https://api.apify.com/v2/acts/steadfetch~openfda-drug-labels-extractor/run-sync-get-dataset-items`, body type `Raw` / JSON, header `Authorization: Bearer <your Apify token>` (paste your own token here; it stays in your Make scenario), body = the input JSON from the README. Enable *Parse response*.
3. Add **Google Sheets → Add a Row**, pick your spreadsheet and sheet, and map the fields you want from step 2 (each result is one row).
4. Run once with **Run once** to verify the mapping, then activate the scenario.

The Apify token is a credential **you** paste into your own Make scenario; no token is stored in this repository.

## Input (paste as the HTTP body)

```json
{
  "search": "openfda.generic_name:\"silicea\"",
  "maxResults": 50
}
```

`search` is openFDA query syntax (`field:"value"`) — swap the field for the molecule, brand or manufacturer you follow.

## Notes

- `run-sync-get-dataset-items` returns when the run finishes (up to 300 seconds); set the HTTP module
  timeout accordingly.
- Each run appends a fresh batch of rows. Where the Actor documents a monitor/deduplication mode,
  turn it on so only new records arrive; otherwise add a **Router + filter** on a stable identifier
  before the Google Sheets module if you do not want repeats.
- Pricing: 3.50 USD per 1,000 labels, plus 0.00005 USD per run start (source: the Actor's Store listing).
- Full input and output reference: the [Store listing](https://apify.com/steadfetch/openfda-drug-labels-extractor).

Built by [Steadfetch](https://apify.com/steadfetch) — *web data that doesn't break*.
