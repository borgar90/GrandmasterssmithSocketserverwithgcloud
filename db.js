const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

/**
 * @description database connection
 * @author Borgar Flaen Stensrud & Hussein Abdul-Ameer
 */

const mongoURI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;
