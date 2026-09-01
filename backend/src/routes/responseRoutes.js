const express = require("express");
const {
  getResponses,
  createResponse,
  clearResponses,
  deleteResponse,
} = require("../controllers/responseController");

const router = express.Router();

router.get("/", getResponses);
router.post("/", createResponse);
router.delete("/", clearResponses);
router.delete("/:id", deleteResponse);

module.exports = router;
