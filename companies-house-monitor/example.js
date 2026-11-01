import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

// Daily watch run: the first run delivers a baseline, later runs deliver only changes.
const run = await client
  .actor('steadfetch/companies-house-monitor')
  .call({ mode: 'watch', monitorMode: true, maxResults: 100 });

const { items } = await client.dataset(run.defaultDatasetId).listItems();
for (const event of items) {
  console.log(event.event_type, event.company_number, event.risk_sub_type ?? '');
}
