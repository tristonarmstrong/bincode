const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const snippetRoutes = require('./snippets');

router.use('/auth', authRoutes);
router.use('/snippets', snippetRoutes);

module.exports = router;