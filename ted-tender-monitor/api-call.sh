#!/usr/bin/env bash
set -euo pipefail
: "${APIFY_TOKEN:?export APIFY_TOKEN first}"

curl -s -X POST \
  "https://api.apify.com/v2/acts/steadfetch~ted-tender-monitor/run-sync-get-dataset-items" \
  -H "Authorization: Bearer ${APIFY_TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{
    "source": "ted",
    "queries": [{ "text": "software", "countries": ["ES"], "minValueEur": 100000 }],
    "maxResults": 50,
    "monitorMode": true
  }'
