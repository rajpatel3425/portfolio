const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve static files from the frontend directory

// Initialize SQLite Database
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create the messages table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// API Route: Submit a new contact message
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = `INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)`;
    const params = [name, email, subject, message];

    db.run(sql, params, function (err) {
        if (err) {
            console.error('Error inserting message', err.message);
            return res.status(500).json({ error: 'Failed to save message' });
        }
        res.status(201).json({ success: true, message: 'Message sent successfully!', id: this.lastID });
    });
});

// API Route: View all messages (Admin endpoint)
app.get('/api/messages', (req, res) => {
    const sql = `SELECT * FROM messages ORDER BY timestamp DESC`;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching messages', err.message);
            return res.status(500).json({ error: 'Failed to retrieve messages' });
        }
        res.status(200).json(rows);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`View messages at http://localhost:${PORT}/api/messages`);
});
