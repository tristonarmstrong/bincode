const snippetQueries = {
    insert: `
      INSERT INTO snippets (id, user_id, title, html, css, js, share_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    getUserSnippets: `
      SELECT * FROM snippets
      WHERE user_id = ?
      ORDER BY created_at DESC
    `,
    getByShareId: `
      SELECT html, css, js, title
      FROM snippets
      WHERE share_id = ?
    `
  };
  
  const userQueries = {
    findByEmail: `
      SELECT * FROM users
      WHERE email = ?
    `,
    insert: `
      INSERT INTO users (id, email, password)
      VALUES (?, ?, ?)
    `
  };
  
  module.exports = {
    snippets: snippetQueries,
    users: userQueries
  };
  