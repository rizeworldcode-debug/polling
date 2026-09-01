const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../voter-counting-survey-website/src/data/voter_list_ward_020.json');
const content = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(content);

const uniqueAreas = new Set();
data.voters.forEach(v => {
  if (v.area_section_details) {
    uniqueAreas.add(v.area_section_details);
  }
});

console.log("Unique area_section_details values for Ward 20:");
console.log(Array.from(uniqueAreas));
