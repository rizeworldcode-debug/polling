const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../voter-counting-survey-website/src/data/voter_list_ward_016.json');
const content = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(content);

const uniqueHouses = new Set();
data.voters.forEach(v => {
  if (v.house_no && isNaN(v.house_no)) {
    uniqueHouses.add(v.house_no);
  }
});

console.log("Unique non-numeric house/address values:");
console.log(Array.from(uniqueHouses));
