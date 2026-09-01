const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    wardNumber: {
      type: String,
      required: true,
    },
    voterName: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    serialNumber: {
      type: Number,
    },
    epicNumber: {
      type: String,
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
    candidateName: {
      type: String,
    },
    selectedChairman: {
      type: String,
    },
    selectedOption: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        // Map _id to id for frontend compatibility
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Response", responseSchema);
