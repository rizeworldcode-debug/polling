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
    const { voterName, fatherName, wardNumber, mobileNumber } = req.body;

    if (!wardNumber) {
      return res.status(400).json({ valid: false, message: "wardNumber is required" });
    }

    if (!voterName || !fatherName) {
      return res.status(400).json({ valid: false, message: "voterName and fatherName are required" });
    }

    const englishVoterName = translateHindiToEnglish(voterName);
    const englishFatherName = translateHindiToEnglish(fatherName);

    const norm = (str) =>
      (str || "")
        .trim()
        .toLowerCase()
        .replace(/^(shri|smt|ku|dr|mr|mrs|shrimati|श्री|श्रीमती)\s+/i, "")
        .replace(/[\s\.\,\_\-\/]+/g, "")
        .replace(/[^a-z0-9\u0900-\u097F]/gi, "");

    const normVoter = norm(voterName);
    const normFather = norm(fatherName);
    const normEngVoter = norm(englishVoterName);
    const normEngFather = norm(englishFatherName);

    // Fetch all existing survey responses across database
    const allResponses = await Response.find({});

    const existingResponse = allResponses.find((r) => {
      // 1. EPIC number match (if epicNumber provided)
      const inputEpic = (req.body.epicNumber || "").trim().toLowerCase();
      const rEpic = (r.epicNumber || "").trim().toLowerCase();
      if (inputEpic && rEpic && inputEpic === rEpic) {
        return true;
      }

      const rVoter = norm(r.voterName);
      const rFather = norm(r.fatherName);

      if (!rVoter || !rFather) return false;

      // 2. Both voterName AND fatherName must match
      const isVoterMatch = (normVoter && rVoter === normVoter) ||
                           (normEngVoter && rVoter === normEngVoter);

      const isFatherMatch = (normFather && rFather === normFather) ||
                            (normEngFather && rFather === normEngFather);

      return isVoterMatch && isFatherMatch;
    });

    if (existingResponse) {
      return res.json({
        valid: false,
        message: "यह मतदाता पहले ही अपना वोट/उत्तर दर्ज कर चुका है।",
      });
    }

    // Optional lookup to attach voter list details if matching record exists
    let voter = null;
    try {
      voter = await Voter.findOne({
        wardNumber: String(wardNumber),
        voterName: { $regex: new RegExp("^" + englishVoterName.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + "$", "i") },
        relativeName: { $regex: new RegExp("^" + englishFatherName.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + "$", "i") },
      });
    } catch (dbErr) {
      console.warn("Voter DB lookup warning:", dbErr);
    }

    return res.json({ valid: true, voter });
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
