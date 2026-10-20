import json
import os

from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run_input = {
    "mode": "company",
    "companyNumber": "00063903",
    "maxResults": 10,
}

run = client.actor("steadfetch/companies-house-monitor").call(run_input=run_input)
items = client.dataset(run["defaultDatasetId"]).list_items().items
print(json.dumps(items, indent=2))
