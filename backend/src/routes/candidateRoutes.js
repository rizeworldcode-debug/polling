const express = require("express");
const router = express.Router();
const { getCandidates } = require("../controllers/candidateController");

router.get("/", getCandidates);

module.exports = router;
