const express=require('express')
const mysql=require('mysql2')
const cors=require('cors')
require('dotenv').config();

const app=express()
app.use(cors())
app.use(express.json())


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});


// Fetch all notes
app.get('/notes', (req, res) => {
    db.query('SELECT * FROM notes', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add a new note
app.post('/notes', (req, res) => {
    const { content } = req.body;
    db.query('INSERT INTO notes (content) VALUES (?)', [content], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, content });
    });
});

// Delete a note
app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM notes WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

// Start server
app.listen(3001, () => {
    console.log('Server running on port 3001');
});