const Candidate = require("../models/Candidate");

const getCandidates = async (req, res) => {
  try {
    const { wardNumber } = req.query;
    const filter = {};
    if (wardNumber) {
      filter.wardNumber = Number(wardNumber);
    }
    const candidates = await Candidate.find(filter).sort({ wardNumber: 1, serialNumber: 1 });
    res.json(candidates);
  } catch (error) {
    console.error("Fetch Candidates Error:", error);
    res.status(500).json({ error: "Failed to fetch candidates" });
  }
};

module.exports = {
  getCandidates,
};
