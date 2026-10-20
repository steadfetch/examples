#!/usr/bin/env bash
# Run steadfetch/companies-house-monitor and print the dataset items as JSON.
#   ./api-call.sh                 # single company (00063903)
#   ./api-call.sh search tesla    # register search, companies since 2025-01-01
set -euo pipefail

: "${APIFY_TOKEN:?Set APIFY_TOKEN (https://console.apify.com/account/integrations)}"

if [ "${1:-company}" = "search" ]; then
  INPUT=$(printf '{"mode":"search","query":"%s","maxResults":100,"since":"2025-01-01"}' "${2:?query required}")
else
  INPUT='{"mode":"company","companyNumber":"00063903","maxResults":10}'
fi

curl -sS -X POST \
  "https://api.apify.com/v2/acts/steadfetch~companies-house-monitor/run-sync-get-dataset-items?token=${APIFY_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "${INPUT}"
