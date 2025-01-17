const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db/connect');
const { users: userQueries } = require('../db/queries');
const config = require('../config');
const { validateAuth } = require('../middleware/validation');

router.post('/login', validateAuth, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const db = getDb();

    db.get(userQueries.findByEmail, [email], async (err, user) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      console.log('User found:', { id: user.id, email: user.email });


      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      res.json({ token });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;