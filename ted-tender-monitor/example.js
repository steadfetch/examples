import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const runInput = {
  source: 'all',
  queries: [{ text: 'software' }],
  maxResults: 10,
  monitorMode: false,
};

const { defaultDatasetId } = await client
  .actor('steadfetch/ted-tender-monitor')
  .call(runInput);

const { items } = await client.dataset(defaultDatasetId).listItems();
console.log(JSON.stringify(items, null, 2));
