import fs from 'fs';

const inputPath = './EDGAR.json'; // adjust path if needed

const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

const usGaap = data?.facts?.['us-gaap'];

if (!usGaap) {
  console.error('No facts["us-gaap"] found in the JSON.');
  process.exit(1);
}

// Filter keys containing "share" or "price" (case-insensitive)
const filteredKeys = Object.keys(usGaap).filter(key =>
  key.toLowerCase().includes('share') || key.toLowerCase().includes('price')
);

if (filteredKeys.length === 0) {
  console.log('No keys found containing "share" or "price".');
} else {
  console.log(`Found ${filteredKeys.length} keys containing "share" or "price":\n`);
  filteredKeys.sort().forEach(k => console.log(`- ${k}`));
}
