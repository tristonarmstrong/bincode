const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const config = require('../config/database');

let db;

const createTables = (db) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // enable foreign keys
      db.run('PRAGMA foreign_keys = ON');

      // users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE,
          password TEXT
        )
      `, (err) => {
        if (err) {
          console.error('Error creating users table:', err);
          reject(err);
        }
      });

      // snippets table
      db.run(`
        CREATE TABLE IF NOT EXISTS snippets (
          id TEXT PRIMARY KEY,
          user_id TEXT,
          title TEXT,
          html TEXT,
          css TEXT,
          js TEXT,
          share_id TEXT UNIQUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id)
        )
      `, (err) => {
        if (err) {
          console.error('Error creating snippets table:', err);
          reject(err);
        }
        resolve();
      });
    });
  });
};

const initializeDb = async () => {
  return new Promise((resolve, reject) => {
    const env = process.env.NODE_ENV || 'development';
    const dbPath = config[env].connection.filename;
    const dbExists = fs.existsSync(dbPath);

    if (db) {
      db.close();
    }
    
    db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, async (err) => {
      if (err) {
        console.error('Database connection error:', err);
        reject(err);
        return;
      }

      try {
        // If database doesn't exist, create tables
        if (!dbExists) {
          await createTables(db);
          console.log('Database tables created successfully');
        }
        
        console.log('Database connection established');
        resolve(db);
      } catch (error) {
        reject(error);
      }
    });
  });
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDb first.');
  }
  return db;
};

module.exports = {
  initializeDb,
  getDb
};

