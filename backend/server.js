const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
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
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password with 10 salt rounds

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).send('Error registering user');
      }
      res.status(201).send('User registered successfully');
    });
  } catch (err) {
    console.error('Error hashing password:', err);
    res.status(500).send('Error registering user');
  }
});

// Login user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      return res.status(500).send('Internal server error');
    }

    if (result.length === 0) {
      return res.status(400).send('Invalid credentials');
    }

    const user = result[0];

    try {
      const isPasswordValid = await bcrypt.compare(password, user.password); // Compare the password with the hashed password
      if (!isPasswordValid) {
        return res.status(400).send('Invalid credentials');
      }

      // Successfully logged in
      res.status(200).json({ id: user.id, username: user.username });
    } catch (err) {
      console.error('Error comparing password:', err);
      res.status(500).send('Error during login');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
