import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const run = await client.actor('steadfetch/ted-tender-monitor').call({
  source: 'ted',
  queries: [{ text: 'software', countries: ['ES'], minValueEur: 100000 }],
  maxResults: 50,
  monitorMode: true,
});

const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(JSON.stringify(items, null, 2));
