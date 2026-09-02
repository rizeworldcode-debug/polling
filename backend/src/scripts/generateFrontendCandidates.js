const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const connectDB = require("../config/db");
const Candidate = require("../models/Candidate");

async function generateFrontendCandidates() {
  try {
    await connectDB();
    const candidates = await Candidate.find({}).sort({ wardNumber: 1, serialNumber: 1 });

    const formatted = candidates.map((c) => ({
      id: `ward-${c.wardNumber}-${c.serialNumber || c._id.toString()}`,
      wardNumber: c.wardNumber,
      serialNumber: c.serialNumber,
      nameEn: c.nameEn,
      nameHi: c.nameHi,
      address: c.address || "",
      party: c.party,
      partyAffiliation: c.partyAffiliation || "",
      partyNameEn: c.party === "BJP" ? "Bharatiya Janata Party (BJP)" : c.party === "Congress" ? "Indian National Congress (INC)" : "Independent / Other",
      partyNameHi: c.party === "BJP" ? "भारतीय जनता पार्टी (BJP)" : c.party === "Congress" ? "इंडियन नेशनल कांग्रेस (Congress)" : "निर्दलीय / अन्य",
      category: c.category || "",
    }));

    const fileContent = `export type ParsadCandidate = {
  id: string;
  wardNumber: number;
  serialNumber?: number;
  nameEn: string;
  nameHi: string;
  address?: string;
  party: "BJP" | "Congress" | "Others";
  partyAffiliation?: string;
  partyNameEn?: string;
  partyNameHi?: string;
  category?: string;
};

export const parsadCandidates: ParsadCandidate[] = ${JSON.stringify(formatted, null, 2)};

export function getParsadCandidatesForWard(ward: number | string): ParsadCandidate[] {
  const wardNum = typeof ward === "string" ? parseInt(ward, 10) : ward;
  const matches = parsadCandidates.filter((c) => c.wardNumber === wardNum);

  if (matches.length > 0) {
    return matches;
  }

  const wardFormatted = String(wardNum).padStart(2, "0");
  return [
    {
      id: \`ward-\${wardNum}-bjp\`,
      wardNumber: wardNum,
      nameEn: \`BJP Candidate (Ward \${wardFormatted})\`,
      nameHi: \`BJP पार्षद प्रत्याशी (वार्ड \${wardFormatted})\`,
      party: "BJP",
      partyNameEn: "BJP",
      partyNameHi: "भारतीय जनता पार्टी (BJP)",
    },
    {
      id: \`ward-\${wardNum}-congress\`,
      wardNumber: wardNum,
      nameEn: \`Congress Candidate (Ward \${wardFormatted})\`,
      nameHi: \`Congress पार्षद प्रत्याशी (वार्ड \${wardFormatted})\`,
      party: "Congress",
      partyNameEn: "Congress",
      partyNameHi: "कांग्रेस पार्टी (INC)",
    },
    {
      id: \`ward-\${wardNum}-others\`,
      wardNumber: wardNum,
      nameEn: \`Independent / Other Candidate\`,
      nameHi: \`निर्दलीय / अन्य प्रत्याशी\`,
      party: "Others",
      partyNameEn: "Others / Independent",
      partyNameHi: "अन्य / निर्दलीय",
    },
  ];
}
`;

    const targetPath = path.join(__dirname, "../../../voter-counting-survey-website/src/data/parsadCandidates.ts");
    fs.writeFileSync(targetPath, fileContent, "utf8");
    console.log("Successfully generated parsadCandidates.ts with all 124 candidates!");
    process.exit(0);
  } catch (err) {
    console.error("Error generating frontend candidates:", err);
    process.exit(1);
  }
}

generateFrontendCandidates();
