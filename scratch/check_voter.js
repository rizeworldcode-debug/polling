const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../backend/.env") });
const connectDB = require("../backend/src/config/db");
const Voter = require("../backend/src/models/Voter");

async function checkVoter() {
  await connectDB();
  const voter = await Voter.findOne({ epicNumber: "WHH0970137" });
  console.log("Voter in DB:", voter);
  mongoose.connection.close();
}

checkVoter();
