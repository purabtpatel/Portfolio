import fs from 'fs';

const inputPath = './EDGAR.json'; // path to AMD JSON
const outputPath = './outputData.json'; // output file
const TARGET_KEY = 'CommonStockValue'; // your target tag

const data = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

const usGaap = data?.facts?.['us-gaap'];

if (!usGaap || !usGaap[TARGET_KEY]) {
  console.error(`❌ Key "${TARGET_KEY}" not found under facts['us-gaap']`);
  process.exit(1);
}

// Extract and save the entire object for that fact
const extracted = usGaap[TARGET_KEY];

fs.writeFileSync(outputPath, JSON.stringify(extracted, null, 2));
console.log(`✅ Extracted "${TARGET_KEY}" to ${outputPath}`);
