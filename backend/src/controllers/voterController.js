const Voter = require("../models/Voter");
const Response = require("../models/Response");

// GET /api/voters/search?name=...&wardNumber=...
const searchVoters = async (req, res) => {
  try {
    const { name, wardNumber } = req.query;

    if (!wardNumber) {
      return res.status(400).json({ error: "wardNumber parameter is required" });
    }

    const query = { wardNumber: String(wardNumber) };

    if (name) {
      // Use regex for case-insensitive matching
      query.voterName = { $regex: name, $options: "i" };
    }

    // Limit to 20 voters for auto-complete performance
    const voters = await Voter.find(query).limit(20);
    res.json(voters);
  } catch (error) {
    console.error("Voter Search Error:", error);
    res.status(500).json({ error: "Failed to search voter list" });
  }
};

const hindiToEnglishMap = {
  "खान": "khan",
  "इस्माइल": "ismail",
  "चन्द्र": "chandra",
  "सदाबनी": "sadabani",
  "समीरा": "samira",
  "अनुषा": "anusha",
  "अल्लाह": "allah",
  "मनीषा": "manisha",
  "इरफ़ान": "irfan",
  "इरफान": "irfan",
  "निज़ामु": "nizamu",
  "दीन": "din",
  "भूरी": "bhoori",
  "सरदारी": "sardari",
  "अहीर": "ahir",
  "देवी": "devi",
  "राम": "ram",
  "शर्मा": "sharma",
  "वर्मा": "verma",
  "सिंह": "singh",
  "कुमार": "kumar",
  "नब्बी": "nabbi",
  "भूरा": "bhoora",
  "बास": "bas",
  "ढाणी": "dhani",
  "कजकपुर": "kajakpur",
};

function translateHindiToEnglish(text) {
  if (!text) return "";
  const hasDevanagari = /[\u0900-\u097F]/.test(text);
  if (!hasDevanagari) return text;

  return text
    .split(/\s+/)
    .map(word => {
      const match = hindiToEnglishMap[word.trim()];
      return match || word;
    })
    .join(" ");
}

const verifyVoter = async (req, res) => {
  try {
    const { voterName, fatherName, wardNumber } = req.body;

    if (!wardNumber) {
      return res.status(400).json({ valid: false, message: "wardNumber is required" });
    }

    if (!voterName || !fatherName) {
      return res.status(400).json({ valid: false, message: "voterName and fatherName are required" });
    }

    const englishVoterName = translateHindiToEnglish(voterName);
    const englishFatherName = translateHindiToEnglish(fatherName);

    // Optional lookup to attach voter list details if matching record exists
    let voter = null;
    try {
      voter = await Voter.findOne({
        wardNumber: String(wardNumber),
        voterName: { $regex: new RegExp("^" + englishVoterName.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "$", "i") },
        relativeName: { $regex: new RegExp("^" + englishFatherName.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "$", "i") }
      });
    } catch (dbErr) {
      console.warn("Voter DB lookup warning:", dbErr);
    }

    if (voter) {
      // Check if this voter has already submitted a response
      const existingResponse = await Response.findOne({
        wardNumber: String(wardNumber),
        voterName: { $regex: new RegExp("^" + englishVoterName.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "$", "i") },
        fatherName: { $regex: new RegExp("^" + englishFatherName.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "$", "i") }
      });

      if (existingResponse) {
        return res.json({ 
          valid: false, 
          message: "आप पहले ही अपना उत्तर दर्ज कर चुके हैं।" 
        });
      }

      return res.json({ valid: true, voter });
    }

    // Name and Relative Name do not need to match voter list DB.
    // Ward selection is sufficient.
    return res.json({ valid: true, voter: null });
  } catch (error) {
    console.error("Voter Verification Error:", error);
    res.status(500).json({ valid: false, message: "Verification failed on server side" });
  }
};

const getVotersByWard = async (req, res) => {
  try {
    const { wardNumber } = req.params;

    if (!wardNumber) {
      return res.status(400).json({ error: "wardNumber parameter is required" });
    }

    const voters = await Voter.find({ wardNumber: String(wardNumber) }).sort({ serialNumber: 1 });
    res.json(voters);
  } catch (error) {
    console.error("Voters By Ward Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch voters by ward" });
  }
};

module.exports = {
  searchVoters,
  verifyVoter,
  getVotersByWard,
};
