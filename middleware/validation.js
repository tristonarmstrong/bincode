const validator = require('validator');
const xss = require('xss');

// auth validation
const validateAuth = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!password || password.length < 4 || password.length > 100) {
    return res.status(400).json({ error: 'Invalid password format' });
  }

  req.body.email = validator.normalizeEmail(email.toLowerCase().trim());

  next();
};

// snippet validation
const validateSnippet = (req, res, next) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.length > 200) {
    return res.status(400).json({ error: 'Invalid title' });
  }

  req.body.title = xss(title.trim());

  // enforce size limits on code content
  const MAX_SIZE = 500 * 1024; // 500KB
  if ((req.body.html?.length || 0) + 
      (req.body.css?.length || 0) + 
      (req.body.js?.length || 0) > MAX_SIZE) {
    return res.status(400).json({ error: 'Content exceeds size limit' });
  }

  next();
};

module.exports = {
  validateAuth,
  validateSnippet
};