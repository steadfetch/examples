#!/usr/bin/env bash
# Run steadfetch/sec-edgar-monitor and print the dataset items as JSON.
#   ./api-call.sh                           # Apple Inc. (CIK 0000320193), 10 filings since 2026-01-01
#   ./api-call.sh search supply agreement   # EDGAR full-text search (8-K, Oct 2026)
set -euo pipefail

: "${APIFY_TOKEN:?Set APIFY_TOKEN (https://console.apify.com/account/integrations)}"

if [ "${1:-cik}" = "search" ]; then
  INPUT=$(printf '{"query":"%s","formTypes":["8-K"],"startDate":"2026-10-01","endDate":"2026-10-17","maxResults":50}' "${2:?query required}")
else
  INPUT='{"cik":"0000320193","formTypes":["10-K","10-Q","8-K"],"startDate":"2026-01-01","maxResults":10}'
fi

curl -sS -X POST \
  "https://api.apify.com/v2/acts/steadfetch~sec-edgar-monitor/run-sync-get-dataset-items?token=${APIFY_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "${INPUT}"
