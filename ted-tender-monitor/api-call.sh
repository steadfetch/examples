#!/usr/bin/env bash
# Run steadfetch/ted-tender-monitor and print the dataset items as JSON.
#   ./api-call.sh                     # latest TED tenders matching "software"
#   ./api-call.sh "medical devices"   # any free-text query
set -euo pipefail

: "${APIFY_TOKEN:?Set APIFY_TOKEN (https://console.apify.com/account/integrations)}"

QUERY="${1:-software}"
INPUT=$(printf '{"source":"all","queries":[{"text":"%s"}],"maxResults":10,"monitorMode":false}' "${QUERY}")

curl -sS -X POST \
  "https://api.apify.com/v2/acts/steadfetch~ted-tender-monitor/run-sync-get-dataset-items?token=${APIFY_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "${INPUT}"
