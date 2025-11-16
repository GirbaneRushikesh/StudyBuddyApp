const mongoose = require("mongoose");

async function attemptConnect(uri, retries = 5, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
      console.log("✅ MongoDB connected:", uri);
      return;
    } catch (err) {
      console.error(`MongoDB connect attempt ${i+1} failed:`, err.message || err);
      if (i < retries - 1) await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw new Error("Unable to connect to MongoDB after multiple attempts");
}

module.exports = async function connectDB() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/studybuddy";
  try {
    await attemptConnect(uri);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
