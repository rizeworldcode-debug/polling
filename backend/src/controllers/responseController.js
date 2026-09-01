const Response = require("../models/Response");

// GET all responses
const getResponses = async (req, res) => {
  try {
    const data = await Response.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch responses from database" });
  }
};

// POST a new response
const createResponse = async (req, res) => {
  try {
    const { 
      wardNumber, 
      voterName, 
      fatherName, 
      mobileNumber, 
      address, 
      selectedOption,
      serialNumber,
      epicNumber,
      houseNumber,
      age,
      gender,
      candidateName,
      selectedChairman
    } = req.body;
    
    // Validate inputs
    if (!wardNumber || !voterName || !fatherName || !mobileNumber || !address || !selectedOption || !selectedChairman) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newResponse = new Response({
      wardNumber,
      voterName,
      fatherName,
      mobileNumber,
      address,
      selectedOption,
      serialNumber,
      epicNumber,
      houseNumber,
      age,
      gender,
      candidateName,
      selectedChairman
    });

    const saved = await newResponse.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ error: "Failed to save response to database" });
  }
};

// DELETE all responses
const clearResponses = async (req, res) => {
  try {
    await Response.deleteMany({});
    res.json({ success: true, message: "Database cleared successfully" });
  } catch (error) {
    console.error("Clear Error:", error);
    res.status(500).json({ error: "Failed to clear database" });
  }
};

// DELETE a single response by ID
const deleteResponse = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Response.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: `Response with ID ${id} not found` });
    }

    res.json({ success: true, message: `Response ${id} deleted successfully` });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Failed to delete response" });
  }
};

module.exports = {
  getResponses,
  createResponse,
  clearResponses,
  deleteResponse,
};
