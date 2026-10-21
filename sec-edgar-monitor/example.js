import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const runInput = {
  cik: '0000320193',
  formTypes: ['10-K', '10-Q', '8-K'],
  startDate: '2026-01-01',
  maxResults: 10,
};

const { defaultDatasetId } = await client
  .actor('steadfetch/sec-edgar-monitor')
  .call(runInput);

const { items } = await client.dataset(defaultDatasetId).listItems();
console.log(JSON.stringify(items, null, 2));
