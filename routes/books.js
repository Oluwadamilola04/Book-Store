const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Review = require('../models/Review');

// GET - Retrieve all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve books', details: error.message });
  }
});

// GET - Search books by ISBN
router.get('/isbn/:isbn', async (req, res) => {
  try {
    const book = await Book.findOne({ isbn: req.params.isbn });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search book by ISBN' });
  }
});

// GET - Search books by author
router.get('/author/:author', async (req, res) => {
  try {
    const authorBooks = await Book.find({
      author: { $regex: req.params.author, $options: 'i' }
    });
    if (authorBooks.length === 0) {
      return res.status(404).json({ error: 'No books found for this author' });
    }
    res.json(authorBooks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search books by author' });
  }
});

// GET - Search books by title
router.get('/title/:title', async (req, res) => {
  try {
    const titleBooks = await Book.find({
      title: { $regex: req.params.title, $options: 'i' }
    });
    if (titleBooks.length === 0) {
      return res.status(404).json({ error: 'No books found with this title' });
    }
    res.json(titleBooks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search books by title' });
  }
});

// GET - Get book details with reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    const bookReviews = await Review.find({ bookId: req.params.id })
      .populate('userId', 'username email profile')
      .sort({ createdAt: -1 });
    
    res.json({
      book,
      reviews: bookReviews,
      totalReviews: bookReviews.length,
      averageRating: book.ratings.averageRating
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve book reviews', details: error.message });
  }
});

module.exports = router;
