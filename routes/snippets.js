const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const auth = require('../middleware/auth');
const { getDb } = require('../db/connect');
const { validateSnippet } = require('../middleware/validation');
const { snippets: snippetQueries } = require('../db/queries'); 

router.post('/', auth, validateSnippet, async (req, res) => {
  const { title, html, css, js } = req.body;
  const snippetId = nanoid();
  const shareId = nanoid(10);
  const db = getDb();

  db.run(
    snippetQueries.insert,
    [snippetId, req.userId, title, html, css, js, shareId],
    (err) => {
      if (err) {
        console.error('Save snippet error:', err);
        return res.status(500).json({ error: 'Error saving snippet' });
      }
      res.json({ id: snippetId, shareId });
    }
  );
});

router.get('/share/:shareId', async (req, res) => {
  const { shareId } = req.params;
  const db = getDb();

  console.log(shareId);
  
  db.get(
    snippetQueries.getByShareId,
    [shareId],
    (err, row) => {
      if (err) {
        console.error('Error fetching snippet:', err);
        return res.status(500).json({ error: 'Error fetching snippet' });
      }

      if (!row) {
        return res.status(404).json({ error: 'Snippet not found' });
      }

      res.json(row);
    }
  );
});

module.exports = router;