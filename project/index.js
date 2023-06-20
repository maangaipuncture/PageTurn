const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'goodreads'
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.log('Error connecting to database: ' + err.stack);
    return;
  }

  console.log('Connected to database with id ' + connection.threadId);
});

// Create an Express app
const app = express();
app.use(bodyParser.json());

// Search for books by title or author
app.get('/books', (req, res) => {
  const { title, author } = req.query;

  // Perform a search query
  let query = `SELECT * FROM books WHERE 1`;
  if (title) {
    query += ` AND title LIKE '%${title}%'`;
  }
  if (author) {
    query += ` AND author LIKE '%${author}%'`;
  }

  // Execute the query
  connection.query(query, (error, results, fields) => {
    if (error) {
      console.log('Error searching for books: ' + error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    // Return the search results
    res.status(200).json(results);
  });
});

// Get book details by book ID
app.get('/books/:id', (req, res) => {
  const bookId = req.params.id;

  // Perform a query to retrieve book details
  const query = `SELECT * FROM books WHERE id = ${bookId}`;
  connection.query(query, (error, results, fields) => {
    if (error) {
      console.log('Error retrieving book details: ' + error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    // Return the book details
    res.status(200).json(results[0]);
  });
});

// Rate and review a book
app.post('/books/:id/ratings', (req, res) => {
  const bookId = req.params.id;
  const { userId, rating, review } = req.body;

  // Perform a query to insert the rating and review into the database
  const query = `INSERT INTO book_ratings (book_id, user_id, rating, review) VALUES (${bookId}, ${userId}, ${rating}, '${review}')`;
  connection.query(query, (error, results, fields) => {
    if (error) {
      console.log('Error inserting rating and review: ' + error);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    // Return a success message
    res.status(200).json({ message: 'Rating and review submitted successfully' });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
