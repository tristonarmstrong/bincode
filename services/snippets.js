const { nanoid } = require('nanoid');
const { getDb } = require('../db/connect');
const { snippets: snippetQueries } = require('../db/queries');

const createSnippet = async (userId, { title, html, css, js }) => {
  const snippetId = nanoid();
  const shareId = nanoid(10);
  const db = getDb();

  return new Promise((resolve, reject) => {
    db.run(
      snippetQueries.insert,
      [snippetId, userId, title, html, css, js, shareId],
      function(err) {
        if (err) reject(err);
        resolve({ id: snippetId, shareId });
      }
    );
  });
};

const getUserSnippets = async (userId) => {
  const db = getDb();

  return new Promise((resolve, reject) => {
    db.all(snippetQueries.getUserSnippets, [userId], (err, snippets) => {
      if (err) reject(err);
      resolve(snippets);
    });
  });
};

const getSharedSnippet = async (shareId) => {
  const db = getDb();

  return new Promise((resolve, reject) => {
    db.get(snippetQueries.getByShareId, [shareId], (err, snippet) => {
      if (err) reject(err);
      resolve(snippet);
    });
  });
};

module.exports = {
  createSnippet,
  getUserSnippets,
  getSharedSnippet
};