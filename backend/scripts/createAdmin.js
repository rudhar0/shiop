// backend/scripts/createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user');

dotenv.config({ path: './config.env' });

const createAdmin = async () => {
  try {
    // Connect to database
    const DB = process.env.DBURI.replace('<db_password>', process.env.DBPASSWORD);
    await mongoose.connect(DB);
    console.log('✅ Connected to MongoDB');

    // Admin user details
    const adminData = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@sabvvhjmaira.com',
      password: 'admin123',
      verified: true,
      isAdmin: true,
      role: 'admin'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email:', adminData.email);
      
      // Update to make sure they're admin
      existingAdmin.isAdmin = true;
      existingAdmin.role = 'admin';
      existingAdmin.verified = true;
      await existingAdmin.save();
      console.log('✅ Updated existing user to admin');
    } else {
      // Create new admin user
      const admin = await User.create(adminData);
      console.log('✅ Admin user created successfully!', admin);
      console.log('\n📧 Email:', adminData.email);
      console.log('🔐 Password:', adminData.password);
    }

    console.log('\n🎉 You can now login with these credentials at /login');
    console.log('🔗 Admin Panel: http://localhost:5173/admin');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();