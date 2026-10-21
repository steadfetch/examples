# Steadfetch examples

Examples and use cases for [Steadfetch](https://apify.com/steadfetch) Actors on the Apify Store: public web data, extracted reliably and schema-validated.

Each folder shows how to call one Actor and what the output looks like. Every folder also ships
**no-code templates**: an importable `n8n-workflow.json` (daily run → rows in Google Sheets) and a
step-by-step `make-guide.md` for Make.

## No-code templates

- **n8n:** import `n8n-workflow.json` (*Workflow menu → Import from File*), add your own *Header Auth*
  credential with `Authorization: Bearer <Apify token>`, point the Google Sheets node at your
  spreadsheet, activate. One row per result, mapped automatically.
- **Make:** follow `make-guide.md` in the folder (Schedule → HTTP → Google Sheets). The Apify token
  is pasted into your own scenario; nothing secret lives in this repository.

No token, credential or personal data is stored in these files.

## Folders

- [`companies-house-monitor/`](companies-house-monitor/) — official UK company records as JSON
  ([Companies House](https://developer.company-information.service.gov.uk/))
- [`sec-edgar-monitor/`](sec-edgar-monitor/) — official SEC EDGAR filing metadata as JSON
  ([SEC EDGAR](https://www.sec.gov/edgar))
- [`ted-tender-monitor/`](ted-tender-monitor/) — EU public procurement notices as JSON
  ([TED](https://ted.europa.eu/))
- [`uk-food-hygiene-monitor/`](uk-food-hygiene-monitor/) — UK food hygiene ratings as JSON
  ([Food Standards Agency](https://www.food.gov.uk/))
- [`cpsc-recall-monitor/`](cpsc-recall-monitor/) — US product recalls as JSON
  ([CPSC SaferProducts.gov API](https://www.saferproducts.gov/RestWebServices/Recall))
- [`fda-recall-monitor/`](fda-recall-monitor/) — FDA food enforcement recalls as JSON
  ([openFDA](https://open.fda.gov/))
- [`openfda-drug-labels-extractor/`](openfda-drug-labels-extractor/) — US drug labels (SPL) as JSON
  ([openFDA](https://open.fda.gov/))
- [`recreation-gov-campground-extractor/`](recreation-gov-campground-extractor/) — campground records
  and campsite inventories ([Recreation.gov](https://www.recreation.gov/))
- [`exceltur-indicadores-extractor/`](exceltur-indicadores-extractor/) — Spain tourism indicator
  series ([Exceltur](https://www.exceltur.org/))
- [`puerto-tenerife-cruceros-monitor/`](puerto-tenerife-cruceros-monitor/) — Tenerife cruise callings
  (Autoridad Portuaria de Santa Cruz de Tenerife)

`companies-house-monitor/` and `sec-edgar-monitor/` also include curl, JavaScript and Python
examples plus a real sample output.

Found a bug or need a field? Open an issue on the Actor page in the Apify Store.
