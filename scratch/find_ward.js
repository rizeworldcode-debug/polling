const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../voter-counting-survey-website/src/data/raw_pdf_text.txt');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log("Total lines:", lines.length);

// Let's find lines containing "कमरप नमबर" or "वपरर सनखखप : 16"
lines.forEach((line, index) => {
  if (line.includes('16') || line.includes('कमरप') || line.includes('वपरर')) {
    // Print lines around matches to see context
    if (line.includes('सनखखप : 16') || line.includes('वपरर सनखखप : 16')) {
      console.log(`Line ${index + 1}: ${line}`);
      console.log("Context:");
      for (let i = Math.max(0, index - 5); i <= Math.min(lines.length - 1, index + 15); i++) {
        console.log(`  [${i + 1}] ${lines[i]}`);
      }
      console.log("-----------------------------------------");
    }
  }
});
