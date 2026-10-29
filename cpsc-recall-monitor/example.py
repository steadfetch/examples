import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    "since": "2026-10-01",
    "maxResults": 100,
    "monitorMode": False,
}

run = client.actor("steadfetch/cpsc-recall-monitor").call(run_input=run_input)
items = client.dataset(run["defaultDatasetId"]).list_items().items
print(json.dumps(items, indent=2))
