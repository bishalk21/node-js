const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conStr = process.env.MONGO_URI;

    if (!conStr) {
      console.log("MongoDB connection string is not defined");
      return;
    }

    const conn = await mongoose.connect(conStr);
    conn && console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
