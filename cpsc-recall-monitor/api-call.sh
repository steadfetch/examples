#!/usr/bin/env bash
# Run steadfetch/cpsc-recall-monitor and print the dataset items as JSON.
#   ./api-call.sh                     # recalls since 2026-10-01
#   ./api-call.sh 2026-01-01 200     # wider window, more results
set -euo pipefail

: "${APIFY_TOKEN:?Set APIFY_TOKEN (https://console.apify.com/account/integrations)}"

SINCE="${1:-2026-10-01}"
MAXRESULTS="${2:-100}"
INPUT=$(printf '{"since":"%s","maxResults":%s,"monitorMode":false}' "${SINCE}" "${MAXRESULTS}")

curl -sS -X POST \
  "https://api.apify.com/v2/acts/steadfetch~cpsc-recall-monitor/run-sync-get-dataset-items?token=${APIFY_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "${INPUT}"
