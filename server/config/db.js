// server/config/db.js
const mongoose = require('mongoose'); // <--- Fixed: Use require

const connectDB = async () => {
  try {
    // 1. Prioritize looking for the Variable in .env file
    // 2. If not found, use this hardcoded string (BUT YOU MUST PUT YOUR REAL PASSWORD HERE)
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://samarthruhelaug23_db_user:Creators5@cluster0.p9cg8un.mongodb.net/aquapulse?retryWrites=true&w=majority');

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;