const crypto = require('crypto');

const generateSecureId = (length = 21) => {
  return crypto
    .randomBytes(Math.ceil(length * 3 / 4))
    .toString('base64')
    .slice(0, length)
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '')
    .trim();
};

module.exports = {
  generateSecureId,
  sanitizeInput
};