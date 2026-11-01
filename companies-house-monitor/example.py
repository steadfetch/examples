import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

# Daily watch run: the first run delivers a baseline, later runs deliver only changes.
run = client.actor("steadfetch/companies-house-monitor").call(
    run_input={"mode": "watch", "monitorMode": True, "maxResults": 100}
)
items = client.dataset(run["defaultDatasetId"]).list_items().items
print(json.dumps(items, indent=2))
