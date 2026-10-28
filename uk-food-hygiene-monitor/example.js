import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const runInput = {
  region: 'Camden',
  maxResults: 100,
  schemeType: 'FHRS',
  strictSchema: true,
};

const { defaultDatasetId } = await client
  .actor('steadfetch/uk-food-hygiene-monitor')
  .call(runInput);

const { items } = await client.dataset(defaultDatasetId).listItems();
console.log(JSON.stringify(items, null, 2));
