import os
from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])

run = client.actor("steadfetch/ted-tender-monitor").call(
    run_input={
        "source": "ted",
        "queries": [{"text": "software", "countries": ["ES"], "minValueEur": 100000}],
        "maxResults": 50,
        "monitorMode": True,
    }
)

for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(item)
