require('dotenv').config();
const path = require('path');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './bincode.db'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'sqlite3',
    connection: {
      filename: process.env.DB_FILE || path.join(__dirname, '..', 'bincode.db')
    },
    useNullAsDefault: true,
    pool: {
      min: 2,
      max: 10
    }
  }
};