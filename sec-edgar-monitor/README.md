# SEC EDGAR Monitor — examples

Run [`steadfetch/sec-edgar-monitor`](https://apify.com/steadfetch/sec-edgar-monitor) from the Apify
API or from JavaScript and Python, and get official SEC EDGAR filing metadata as JSON: accession
number, form type, filing and report dates, acceptance datetime and the primary document URL.

- Store: <https://apify.com/steadfetch/sec-edgar-monitor>
- Source data: the official [SEC EDGAR JSON endpoints](https://www.sec.gov/search-filings/edgar-application-programming-interfaces)
  — no API key needed. Filing metadata and issuer organisations only; no officer or contact data.
- Pricing: 5.00 USD per 1,000 filings, plus 0.00005 USD per run start.

## Prerequisites

- An Apify account and token (<https://console.apify.com/account/integrations>). A free tier works.
- `APIFY_TOKEN` in your environment for every example below.
- No SEC key: EDGAR's endpoints are anonymous. The Actor sends the declared User-Agent the SEC
  requires and stays under the published limit of 10 requests per second.

## 1. API call (curl)

```bash
./api-call.sh                                # Apple Inc. (CIK 0000320193), 10 filings since 2026-01-01
./api-call.sh search "supply agreement"      # EDGAR full-text search: 8-K, 2026-10-01..2026-10-17
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

`output.example.json` is the sample record published on the Store listing (fixture of 2026-10-19,
issuer Apple Inc., CIK `0000320193`). One dataset item per filing; every item is checked against
the published dataset schema, so a source change fails the run instead of delivering bad data.

```json
{
  "accession_no": "0000320193-26-000020",
  "cik": "0000320193",
  "company_name": "Apple Inc.",
  "form_type": "10-Q",
  "filing_date": "2026-07-31",
  "report_date": "2026-06-27",
  "acceptance_datetime": "2026-07-31T14:01:02.000Z",
  "primary_document_url": "https://www.sec.gov/Archives/edgar/data/320193/000032019326000020/aapl-20260627.htm",
  "is_amendment": false,
  "url": "https://www.sec.gov/Archives/edgar/data/320193/000032019326000020/aapl-20260627.htm",
  "scrapedAt": "2026-10-19T12:00:00.000Z"
}
```

`url` mirrors `primary_document_url`. `acceptance_datetime` is `null` when EDGAR's full-text
endpoint does not return it; the Actor never invents timestamps.

## Input reference

| Field | Type | Description |
|---|---|---|
| `cik` | string | Issuer CIK, 10 digits with leading zeros (e.g. `0000320193`). |
| `query` | string | EDGAR full-text query (e.g. `supply agreement`). |
| `formTypes` | string[] | Filter by form type, e.g. `["10-K", "10-Q", "8-K"]`. |
| `startDate` | string | `YYYY-MM-DD`; keep filings filed on or after it. |
| `endDate` | string | `YYYY-MM-DD`; keep filings filed on or before it. |
| `maxResults` | integer | Caps the number of filings returned. |

At least one of `cik` or `query` is required. Example input:

```json
{
  "cik": "0000320193",
  "formTypes": ["10-K", "10-Q", "8-K"],
  "startDate": "2026-01-01",
  "maxResults": 10
}
```

Built by [Steadfetch](https://apify.com/steadfetch) — *web data that doesn't break*.
