const auth = require('./auth');
const errorHandler = require('./error');
const { validateSnippet } = require('./validation');

module.exports = {
  auth,
  errorHandler,
  validateSnippet
};