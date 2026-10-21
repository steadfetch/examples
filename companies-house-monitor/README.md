# Companies House Monitor — examples

> Apify Store title: **UK Companies House Data Scraper (Company Records JSON)**

Run [`steadfetch/companies-house-monitor`](https://apify.com/steadfetch/companies-house-monitor) from
the Apify API or from JavaScript and Python, and get official UK company records as JSON:
status, type, SIC codes, incorporation date, accounts-overdue flag and registered office address.

- Store: <https://apify.com/steadfetch/companies-house-monitor>
- Source data: [Companies House](https://developer.company-information.service.gov.uk/) (Open
  Government Licence v3.0), company-level fields only — no officers, no PSCs, no personal data.
- Pricing: 2.50 USD per 1,000 valid results, plus 0.00005 USD per run start.

## Prerequisites

- An Apify account and token (<https://console.apify.com/account/integrations>). A free tier works.
- `APIFY_TOKEN` in your environment for every example below.
- No Companies House key needed: the Actor uses one internally (you can pass your own free key
  through the optional `apiKey` input).

## 1. API call (curl)

```bash
./api-call.sh            # single company, 00063903
./api-call.sh search tesla
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

`output.example.json` is a real record from the fixture run of 2026-10-19 (company `08209948`).
One dataset item per company; every item is checked against the published dataset schema
(`strictSchema` defaults to `true`).

```json
{
    "company_number": "08209948",
    "company_name": "! LTD",
    "company_status": "active",
    "company_type": "ltd",
    "sic_codes": ["99999"],
    "incorporated_on": "2012-09-11",
    "accounts_overdue": false,
    "address": { "locality": "HARROGATE", "postal_code": "HG1 1ND", "country": "England" }
}
```

## Input reference

| Field | Type | Description |
|---|---|---|
| `mode` | `company` \| `search` | Required. Single profile lookup or register search. |
| `companyNumber` | string | Required when `mode=company` (e.g. `00063903`). |
| `query` | string | Required when `mode=search` (name or number). |
| `maxResults` | integer | Default 100, maximum 5000. |
| `since` | string | Optional `YYYY-MM-DD`; search mode keeps companies incorporated on or after it. |
| `strictSchema` | boolean | Default `true`; fail the run on schema violations. |

## No-code

**Use case:** monitor new UK companies in your sector every morning into Google Sheets: one row per company with status, type, incorporation date, SIC codes and registered office, so a sales or compliance team starts the day with a fresh list instead of refreshing the Companies House register by hand.

### n8n — daily rows into Google Sheets

1. Download [`n8n-workflow.json`](./n8n-workflow.json) and import it in n8n: **Workflow menu → Import from File**.
2. Create a **Header Auth** credential named `Apify API token`: header name `Authorization`, value `Bearer <your token>` (copy the token from <https://console.apify.com/account/integrations>). Select it in the **Run the Actor** node. The token stays in your n8n credential — it is not in this repository.
3. In **Append rows to Google Sheet**, paste your spreadsheet URL (share the sheet with the account n8n uses) and the tab name, and pick your Google Sheets credential.
4. Open **Run the Actor** and adjust the input body — `mode: search` + `query` is your sector keyword; `since` keeps companies incorporated on or after that date. Set `since` to yesterday for a daily "new companies" feed.
5. Activate the workflow. It runs daily at 07:00 (change the schedule on the first node) and appends one row per result, mapped automatically from the JSON fields.

### Make — step by step

1. In Make, create a new scenario and add **Schedule** (e.g. daily at 07:00).
2. Add **HTTP → Make a request**: `POST https://api.apify.com/v2/acts/steadfetch~companies-house-monitor/run-sync-get-dataset-items`, body type `Raw` / JSON, header `Authorization: Bearer <your Apify token>` (paste your own token here; it stays in your Make scenario), body = the input JSON from the README. Enable *Parse response*.
3. Add **Google Sheets → Add a Row**, pick your spreadsheet and sheet, and map the fields you want from step 2 (each result is one row).
4. Run once with **Run once** to verify the mapping, then activate the scenario.

The Apify token is a credential **you** paste into your own Make scenario; no token is stored in this repository.

Detailed Make instructions for this Actor: [`make-guide.md`](./make-guide.md).

Built by [Steadfetch](https://apify.com/steadfetch) — *web data that doesn't break*.
