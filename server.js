require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const { initializeDb } = require('./db/connect');
const routes = require('./routes');

const app = express();

app.set('trust proxy', true);

app.use(rateLimit({
  windowMs: 5 * 60 * 1000, // 5min
  max: 100, // 100 request per IP
}));

app.use(express.json());
app.use(express.static('public'));

// routes
app.use('/api', routes);

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await initializeDb();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
