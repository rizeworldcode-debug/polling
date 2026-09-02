const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    wardNumber: {
      type: Number,
      required: true,
    },
    serialNumber: {
      type: Number,
    },
    nameEn: {
      type: String,
      required: true,
    },
    nameHi: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    party: {
      type: String,
      enum: ["BJP", "Congress", "Others"],
      required: true,
    },
    partyAffiliation: {
      type: String,
    },
    category: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Candidate", candidateSchema);
