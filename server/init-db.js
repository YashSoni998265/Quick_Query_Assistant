const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure db directory exists
const dbDir = path.resolve(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`Created database directory: ${dbDir}`);
}

// Resolve absolute path to database file
const dbPath = path.resolve(dbDir, 'database.sqlite');
console.log(`Attempting to open database at: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    console.error('Check if you have write permissions to:', dbPath);
    process.exit(1);
  }
  console.log('Connected to SQLite database.');
});

// Create and populate employees table
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      salary INTEGER NOT NULL,
      department TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
        process.exit(1);
      }
      console.log('Employees table created or already exists.');
    }
  );

  // Insert mock data
  const stmt = db.prepare(
    `INSERT OR IGNORE INTO employees (id, name, salary, department) VALUES (?, ?, ?, ?)`
  );
  const employees = [
    [1, 'Alice Smith', 60000, 'Sales'],
    [2, 'Bob Johnson', 55000, 'Marketing'],
    [3, 'Charlie Brown', 70000, 'Sales'],
    [4, 'Diana Prince', 65000, 'Engineering'],
    [5, 'Eve Adams', 50000, 'Marketing']
  ];
  employees.forEach((emp) => {
    stmt.run(emp[0], emp[1], emp[2], emp[3], (err) => {
      if (err) {
        console.error('Error inserting data for employee:', emp, err.message);
      }
    });
  });
  stmt.finalize((err) => {
    if (err) {
      console.error('Error finalizing statement:', err.message);
      process.exit(1);
    }
    console.log('Mock data inserted successfully.');
  });
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
    process.exit(1);
  }
  console.log('Database initialized and closed.');
});