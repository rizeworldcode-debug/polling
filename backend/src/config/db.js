const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URL;
    if (!connStr) {
      throw new Error("MONGO_URL env variable is not defined in .env file");
    }
    
    await mongoose.connect(connStr);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
