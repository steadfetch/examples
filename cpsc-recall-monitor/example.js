import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const runInput = {
  since: '2026-10-01',
  maxResults: 100,
  monitorMode: false,
};

const { defaultDatasetId } = await client
  .actor('steadfetch/cpsc-recall-monitor')
  .call(runInput);

const { items } = await client.dataset(defaultDatasetId).listItems();
console.log(JSON.stringify(items, null, 2));
