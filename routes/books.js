const express = require('express');
const router = express.Router();
const db = require('../db');

// GET - Retrieve all books
router.get('/', (req, res) => {
  try {
    res.json(db.books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve books' });
  }
});

// GET - Search books by ISBN
router.get('/isbn/:isbn', (req, res) => {
  try {
    const book = db.books.find(b => b.isbn === req.params.isbn);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search book by ISBN' });
  }
});

// GET - Search books by author
router.get('/author/:author', (req, res) => {
  try {
    const authorBooks = db.books.filter(b => 
      b.author.toLowerCase().includes(req.params.author.toLowerCase())
    );
    if (authorBooks.length === 0) {
      return res.status(404).json({ error: 'No books found for this author' });
    }
    res.json(authorBooks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search books by author' });
  }
});

// GET - Search books by title
router.get('/title/:title', (req, res) => {
  try {
    const titleBooks = db.books.filter(b => 
      b.title.toLowerCase().includes(req.params.title.toLowerCase())
    );
    if (titleBooks.length === 0) {
      return res.status(404).json({ error: 'No books found with this title' });
    }
    res.json(titleBooks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search books by title' });
  }
});

// GET - Get book details with reviews
router.get('/:id/reviews', (req, res) => {
  try {
    const book = db.books.find(b => b.id === parseInt(req.params.id));
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    const bookReviews = db.reviews.filter(r => r.bookId === parseInt(req.params.id));
    const averageRating = bookReviews.length > 0 
      ? (bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length).toFixed(2)
      : 0;
    
    res.json({
      book,
      reviews: bookReviews,
      totalReviews: bookReviews.length,
      averageRating
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve book reviews' });
  }
});

module.exports = router;
