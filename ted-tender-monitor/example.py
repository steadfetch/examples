import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    "source": "all",
    "queries": [{"text": "software"}],
    "maxResults": 10,
    "monitorMode": False,
}

run = client.actor("steadfetch/ted-tender-monitor").call(run_input=run_input)
items = client.dataset(run["defaultDatasetId"]).list_items().items
print(json.dumps(items, indent=2))
