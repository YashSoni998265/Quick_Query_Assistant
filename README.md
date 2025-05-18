<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
 
</head>
<body>

  <h1>Project Title</h1>
  <p class="highlight">QuickQuery - SQL Assistant for Non-Tech Users</p>

  <h2>Short Description</h2>
  <p>
    <strong>QuickQuery</strong> is a web app that lets anyone explore a company database using plain English queries like <em>“show employees in Sales”</em> or <em>“names starting with A”</em>.
    It automatically converts your input into SQL and shows results in a clean, responsive table—no coding required.
    Built for HR, managers, and team leads, it includes an experimental AI module for more intuitive querying.
  </p>

  <h2>Tech Stack</h2>
  <ul>
    <li><strong>Backend:</strong> Node.js (Express), SQLite, Compromise (NLP)</li>
    <li><strong>Frontend:</strong> React, Tailwind CSS, Axios</li>
    <li><strong>Other:</strong> JavaScript, CORS</li>
  </ul>

  <h2>Features</h2>
  <ul>
    <li><span class="highlight">Natural Language Queries:</span> Ask things like “salary between 50k and 60k” or “department = Sales.”</li>
    <li><span class="highlight">Smart Filters:</span> Exact matches (e.g., “name is Alice”), partials (“name ends with n”), or ranges (“salary between ...”).</li>
    <li><span class="highlight">Clean UI:</span> Responsive table with styled header, alternating rows, and a live loading spinner. Displays generated SQL clearly.</li>
    <li><span class="highlight">Error Feedback:</span> Friendly alerts like <em>“Unsupported query format”</em> help you adjust inputs.</li>
    <li><span class="highlight">AI-Powered Preview:</span> Experimental NLP parses queries to prepare for more advanced understanding in the future.</li>
  </ul>

  <h2>How to Run</h2>
  <p><strong>Prerequisites:</strong> Windows, Node.js v16+, and ~500MB free space.</p>

  <h3>Backend Setup</h3>
  <ul>
    <li>Open PowerShell and run:</li>
    <code>cd F:\hackathon\server</code><br />
    <code>npm install</code><br />
    <code>npm start</code>
    <li>If successful, backend runs at <code>http://localhost:5000</code></li>
  </ul>

  <h3>Frontend Setup</h3>
  <ul>
    <li>Open another PowerShell window:</li>
    <code>cd F:\hackathon\client</code><br />
    <code>npm install</code><br />
    <code>npm start</code>
    <li>Access app at <code>http://localhost:3000</code></li>
  </ul>

  <h3>Try It Out</h3>
  <ul>
    <li>Example query: <em>“salary greater than 60000”</em></li>
    <li>Results appear in a table with SQL displayed above.</li>
    <li>Typos or unsupported formats show helpful messages.</li>
  </ul>

  <h3>Troubleshooting Tips</h3>
  <ul>
    <li><strong>Server not starting?</strong> Check the <code>db</code> folder exists. Delete <code>database.sqlite</code> and retry.</li>
    <li><strong>Frontend blank?</strong> Ensure the backend is running. Open DevTools → Network tab to inspect API calls.</li>
    <li><strong>Slow install?</strong> Run <code>npm cache clean --force</code> and try again.</li>
  </ul>

  <h2>AI Usage</h2>
  <p>
    QuickQuery includes an experimental AI feature powered by the <strong>Compromise</strong> NLP library.
    While still under development, it analyzes English queries to detect structure (like columns, filters, operators).
  </p>
  <ul>
    <li><span class="highlight">Example:</span> “name is Alice” → <code>SELECT * FROM employees WHERE name = 'Alice'</code></li>
    <li><strong>Current Status:</strong> Experimental only—doesn't return results yet.</li>
    <li><strong>Why It Matters:</strong> It shows our goal of enabling fully conversational database access.</li>
    <li><strong>Next Steps:</strong> Extend support for aggregations, fuzzy matches, and join queries.</li>
  </ul>

  <p><strong>Built for the HackMern Hackathon, May 2025</strong></p>

</body>
</html>
