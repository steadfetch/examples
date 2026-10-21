import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    "cik": "0000320193",
    "formTypes": ["10-K", "10-Q", "8-K"],
    "startDate": "2026-01-01",
    "maxResults": 10,
}

run = client.actor("steadfetch/sec-edgar-monitor").call(run_input=run_input)
items = client.dataset(run["defaultDatasetId"]).list_items().items
print(json.dumps(items, indent=2))
