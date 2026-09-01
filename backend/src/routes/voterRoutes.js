const express = require("express");
const { searchVoters, verifyVoter, getVotersByWard } = require("../controllers/voterController");

const router = express.Router();

router.get("/search", searchVoters);
router.post("/verify", verifyVoter);
router.get("/ward/:wardNumber", getVotersByWard);

module.exports = router;
