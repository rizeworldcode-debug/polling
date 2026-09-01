const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema(
  {
    serialNumber: {
      type: Number,
    },
    epicNumber: {
      type: String,
      index: true,
      sparse: true, // Allow multiple nulls if some voters don't have EPIC
    },
    voterName: {
      type: String,
      required: true,
      index: true,
    },
    relativeName: {
      type: String, // Father's/Husband's/Relative's name
    },
    houseNumber: {
      type: String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    wardNumber: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to speed up combined search by name and ward
voterSchema.index({ voterName: "text", wardNumber: 1 });

module.exports = mongoose.model("Voter", voterSchema);
