import bcrypt from 'bcrypt';
import db from './config/db.js';

// Admin credentials
const adminData = {
  name: 'Admin User',
  email: 'admin@mail.com',
  password: 'admin123', // Will be hashed
  role: 'admin'
};

// Hash password
const hashedPassword = bcrypt.hashSync(adminData.password, 10);

// Insert admin into database
const sql = `
  INSERT INTO users (name, email, password, role)
  VALUES (?, ?, ?, ?)
`;

db.query(sql, [adminData.name, adminData.email, hashedPassword, adminData.role], (err, result) => {
  if (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.log('❌ Admin user already exists with email:', adminData.email);
    } else {
      console.error('❌ Error creating admin:', err.message);
    }
    process.exit(1);
  }
  
  console.log('✅ Admin user created successfully!');
  console.log('📧 Email:', adminData.email);
  console.log('🔑 Password:', adminData.password);
  console.log('🆔 User ID:', result.insertId);
  console.log('\nYou can now login as admin using these credentials.');
  
  process.exit(0);
});
