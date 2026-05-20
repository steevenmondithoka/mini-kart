const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("Trying Mongo URI:", process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("FULL ERROR:");
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;