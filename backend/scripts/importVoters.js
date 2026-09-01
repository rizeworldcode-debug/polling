const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const fs = require("fs");
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Voter = require("../src/models/Voter");

const importData = async () => {
  const args = process.argv.slice(2);
  const filePathArg = args[0];
  const wardNumberArg = args[1];

  if (!filePathArg || !wardNumberArg) {
    console.error("Error: Please provide file path and ward number.");
    console.log("Usage: node scripts/importVoters.js <file-path> <ward-number>");
    console.log("Example: node scripts/importVoters.js ../voter-counting-survey-website/src/data/voter_list_ward_001.json 1");
    process.exit(1);
  }

  const absolutePath = path.resolve(filePathArg);
  if (!fs.existsSync(absolutePath)) {
    console.error(`Error: File not found at path: ${absolutePath}`);
    process.exit(1);
  }

  try {
    // 1. Connect to DB
    await connectDB();

    // 2. Read file
    console.log(`Reading voter data from ${absolutePath}...`);
    const rawData = fs.readFileSync(absolutePath, "utf8");
    const jsonParsed = JSON.parse(rawData);

    // Support both direct array or nested { voters: [...] } or { electoral_roll_data: [...] }
    const voterArray = Array.isArray(jsonParsed) ? jsonParsed : (jsonParsed.voters || jsonParsed.electoral_roll_data || jsonParsed.Voters);

    if (!Array.isArray(voterArray) || voterArray.length === 0) {
      throw new Error("No voters found in JSON file. It should be a JSON array of voters.");
    }

    console.log(`Loaded ${voterArray.length} voters. Formatting data...`);

    // 3. Format voters
    const formattedVoters = voterArray
      .filter((v) => (v.voterName || v["Name"] || v.name || v["Voter Name"] || v.voter_name || v["Elector Name"] || v["Voter Name (English)"]))
      .map((v) => ({
      serialNumber: v.serialNumber !== undefined ? v.serialNumber : (v["S.No."] !== undefined ? v["S.No."] : (v.s_no !== undefined ? v.s_no : (v.sno !== undefined ? v.sno : (v.Serial_No !== undefined ? Number(v.Serial_No) : null)))),
      epicNumber: v.epic_no || v.epicNumber || v["EPIC / Voter ID"] || v["EPIC / Voter ID No."] || v["EPIC No."] || v.epic_voter_id || v.EPIC_ID || null,
      voterName: v.voterName || v["Name"] || v.name || v["Voter Name"] || v.voter_name || v["Elector Name"] || v["Voter Name (English)"] || "",
      relativeName: v.relativeName || v["Relative Name"] || v.relative_name || v.relation_name || v.Relative_Name || v["Relation Name"] || v["Relative Name (English)"] || "",
      houseNumber: v.houseNumber || v["House No."] || v.house_no || v.House_No || "",
      age: v.age !== undefined ? v.age : (v.Age !== undefined ? Number(v.Age) : null),
      gender: v.gender || v.Gender || "",
      wardNumber: String(wardNumberArg),
    }));

    // 4. Clear existing voters for this ward to prevent duplicates
    console.log(`Clearing existing voters for Ward ${wardNumberArg}...`);
    await Voter.deleteMany({ wardNumber: String(wardNumberArg) });

    // 5. Insert voters
    console.log(`Inserting ${formattedVoters.length} voters into MongoDB...`);
    const result = await Voter.insertMany(formattedVoters);
    console.log(`Success! Imported ${result.length} voters for Ward ${wardNumberArg} successfully.`);
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Import failed with error:", error);
    if (mongoose.connection) {
      mongoose.connection.close();
    }
    process.exit(1);
  }
};

importData();
