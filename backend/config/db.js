// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const DB = process.env.DBURI.replace(
      '<db_password>', 
      process.env.DBPASSWORD
    );

    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;