const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { textToSQL } = require('./text-to-sql');
const path = require('path');
const fs = require('fs');

// Ensure db directory exists
const dbDir = path.resolve(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`Created database directory: ${dbDir}`);
}

const dbPath = path.resolve(dbDir, 'database.sqlite');
console.log(`Connecting to database at: ${dbPath}`);

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    console.error('Check if you have write permissions to:', dbPath);
    console.error('Ensure init-db.js has been run successfully.');
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
});

app.post('/query', async (req, res) => {
  const { queryText } = req.body;
  if (!queryText || typeof queryText !== 'string') {
    return res.status(400).json({ error: 'Invalid query text' });
  }

  try {
    const sqlQuery = textToSQL(queryText);
    if (!sqlQuery) {
      return res.status(400).json({ error: 'Unsupported query format' });
    }

    db.all(sqlQuery, [], (err, rows) => {
      if (err) {
        console.error('Query error:', err.message);
        return res.status(500).json({ error: 'Query execution failed' });
      }
      res.json({ sql: sqlQuery, results: rows });
    });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));