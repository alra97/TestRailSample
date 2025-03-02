const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'mariadb', // Replace with your MySQL password
  database: 'quiz_app',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
    return;
  }
  console.log('Connected to the database!');
});

// Register a new user
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).send('Error registering user');
    }
    res.status(201).send('User registered successfully');
  });
});

// Login user
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Internal server error');
    }

    if (result.length === 0) {
      return res.status(400).send('Invalid credentials');
    }

    const user = result[0];

    // Compare plain text password
    if (user.password !== password) {
      return res.status(400).send('Invalid credentials');
    }

    // Successfully logged in
    res.status(200).json({ id: user.id, username: user.username });
  });
});

// Assuming you have already connected to your MySQL database

// Endpoint to handle the score submission
app.post('/submit-score', (req, res) => {
  const { userId, score, time } = req.body;

  if (!userId || score === undefined || time === undefined) {
    return res.status(400).send('Missing required parameters');
  }

  const query = 'UPDATE scores SET score = ?, time_taken = ? WHERE user_id = ?';
  db.query(query, [score, time, userId], (err, result) => {
    if (err) {
      console.error('Error updating score:', err);
      return res.status(500).send('Error updating score');
    }

    if (result.affectedRows > 0) {
      res.status(200).send('Score updated successfully');
    } else {
      res.status(400).send('User not found');
    }
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
