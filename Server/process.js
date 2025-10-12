// listUsGaapKeys.js
import fs from 'fs';

// Load the JSON file (adjust path if needed)
const rawData = fs.readFileSync('./EDGAR.json', 'utf-8');
const data = JSON.parse(rawData);

// Check the path exists
if (!data.facts || !data.facts['us-gaap']) {
  console.error('Could not find facts["us-gaap"] in the file.');
  process.exit(1);
}

// Extract and list all top-level keys under us-gaap
const usGaapKeys = Object.keys(data.facts['us-gaap']);
usGaapKeys.sort(); // optional, alphabetize

console.log(`Found ${usGaapKeys.length} us-gaap keys:\n`);
usGaapKeys.forEach(key => {
  console.log(`- ${key}`);
});
