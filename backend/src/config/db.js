/**
 * MongoDB connection with retry logic
 */
const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
  const MAX_RETRIES = 5;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      logger.info(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      retries++;
      logger.error(`MongoDB connection attempt ${retries}/${MAX_RETRIES} failed: ${error.message}`);
      if (retries < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 3000)); // wait 3s before retry
      }
    }
  }

  logger.error("❌ Could not connect to MongoDB. Exiting.");
  process.exit(1);
};

module.exports = connectDB;
