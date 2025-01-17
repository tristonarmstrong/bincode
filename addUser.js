require('dotenv').config();
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const { initializeDb, getDb } = require('./db/connect');

async function addUser(email, password) {
  try {
    await initializeDb();
    const db = getDb();

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userId = nanoid();

    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO users (id, email, password)
        VALUES (?, ?, ?)
      `;
      
      db.run(query, [userId, email, hashedPassword], function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT') {
            reject(new Error('Email already exists'));
          } else {
            reject(err);
          }
        } else {
          resolve({
            id: userId,
            email: email
          });
        }
      });
    });
  } catch (error) {
    throw error;
  }
}

if (require.main === module) {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: node addUser.js <email> <password>');
    process.exit(1);
  }

  addUser(email, password)
    .then(user => {
      console.log('User added successfully:', user);
      console.log('You can now login with:');
      console.log('Email:', email);
      console.log('Password:', password);
      process.exit(0);
    })
    .catch(error => {
      console.error('Error adding user:', error.message);
      process.exit(1);
    });
}