const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const mongoURI = 'mongodb+srv://mishragargi375_db_user:Gargi123@cluster0.kdoiqdv.mongodb.net/servicehub?retryWrites=true&w=majority'

async function createAdmin() {
  try {
    await mongoose.connect(mongoURI);

    const email = '2023aspire194@gmail.com';
    const password = 'gm123';
    const Phone = '8601860318';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('Admin with this email already exists.');
      process.exit(0);
    }

    const adminUser = new User({
      name: 'Admin User',
      email: email,
      password: 'gm123', 
      phone: Phone,
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Failed to create admin:', error);
    process.exit(1);
  }
}

createAdmin();
