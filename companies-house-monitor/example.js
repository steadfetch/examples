import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

const runInput = {
  mode: 'company',
  companyNumber: '00063903',
  maxResults: 10,
};

const { defaultDatasetId } = await client
  .actor('steadfetch/companies-house-monitor')
  .call(runInput);

const { items } = await client.dataset(defaultDatasetId).listItems();
console.log(JSON.stringify(items, null, 2));
