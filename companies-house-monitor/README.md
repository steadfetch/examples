# Companies House Monitor — examples

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

Built by [Steadfetch](https://apify.com/steadfetch) — *web data that doesn't break*.
