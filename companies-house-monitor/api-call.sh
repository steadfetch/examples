#!/usr/bin/env bash
# Run steadfetch/companies-house-monitor and print the dataset items (delta events) as JSON.
#   ./api-call.sh add        # one-time: add a company watch + a saved search (bills nothing)
#   ./api-call.sh watch      # daily: evaluate the watchlist, deliver only changes
#   ./api-call.sh snapshot   # one-off: backfill every stored watch (no check charges)
set -euo pipefail

: "${APIFY_TOKEN:?Set APIFY_TOKEN (https://console.apify.com/account/integrations)}"

case "${1:-watch}" in
  add)
    INPUT='{"mode":"manage","manage":{"action":"add","targets":[{"type":"company","company_number":"08209948"},{"type":"query","query":"renewable","since":"2026-01-01"}]}}'
    ;;
  snapshot)
    INPUT='{"mode":"watch","monitorMode":false,"maxResults":100}'
    ;;
  *)
    INPUT='{"mode":"watch","monitorMode":true,"maxResults":100}'
    ;;
esac

curl -sS -X POST \
  "https://api.apify.com/v2/acts/steadfetch~companies-house-monitor/run-sync-get-dataset-items?token=${APIFY_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "${INPUT}"
