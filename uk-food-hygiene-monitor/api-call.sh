#!/usr/bin/env bash
# Run steadfetch/uk-food-hygiene-monitor and print the dataset items as JSON.
#   ./api-call.sh                 # establishments in Camden (FHRS)
#   ./api-call.sh Glasgow FHIS    # Scottish scheme (FHIS)
set -euo pipefail

: "${APIFY_TOKEN:?Set APIFY_TOKEN (https://console.apify.com/account/integrations)}"

REGION="${1:-Camden}"
SCHEME="${2:-FHRS}"
INPUT=$(printf '{"region":"%s","maxResults":100,"schemeType":"%s","strictSchema":true}' "${REGION}" "${SCHEME}")

curl -sS -X POST \
  "https://api.apify.com/v2/acts/steadfetch~uk-food-hygiene-monitor/run-sync-get-dataset-items?token=${APIFY_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "${INPUT}"
