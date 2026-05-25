const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Book = require('../models/Book');
const { isAuthenticated } = require('../middleware/auth');

// GET - Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'username email profile')
      .populate('bookId', 'title author isbn')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve reviews', details: error.message });
  }
});

// GET - Get reviews for a specific book
router.get('/book/:bookId', async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const bookReviews = await Review.find({ bookId: req.params.bookId })
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

// POST - Add a new review (logged in users only)
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;

    // Validation
    if (!bookId || rating === undefined || !comment) {
      return res.status(400).json({ error: 'bookId, rating, and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (comment.length < 10) {
      return res.status(400).json({ error: 'Comment must be at least 10 characters' });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      bookId,
      userId: req.session.userId
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this book' });
    }

    // Create new review
    const newReview = new Review({
      bookId,
      userId: req.session.userId,
      username: req.session.username,
      rating: parseInt(rating),
      comment
    });

    await newReview.save();

    // Update user's review count
    const user = await require('../models/User').findById(req.session.userId);
    user.profile.totalReviews += 1;
    await user.save();

    res.status(201).json({
      message: 'Review added successfully',
      review: await newReview.populate('userId', 'username email profile')
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review', details: error.message });
  }
});

// PUT - Modify a review (logged in users can only modify their own)
router.put('/:reviewId', isAuthenticated, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Find review
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check authorization
    if (review.userId.toString() !== req.session.userId) {
      return res.status(403).json({ error: 'You can only modify your own reviews' });
    }

    // Validation
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (comment && comment.length < 10) {
      return res.status(400).json({ error: 'Comment must be at least 10 characters' });
    }

    // Update review
    if (rating !== undefined) {
      review.rating = parseInt(rating);
    }
    if (comment !== undefined) {
      review.comment = comment;
    }
    review.updatedAt = new Date();

    await review.save();

    res.json({
      message: 'Review updated successfully',
      review: await review.populate('userId', 'username email profile')
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review', details: error.message });
  }
});

// DELETE - Delete a review (logged in users can only delete their own)
router.delete('/:reviewId', isAuthenticated, async (req, res) => {
  try {
    // Find review
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check authorization
    if (review.userId.toString() !== req.session.userId) {
      return res.status(403).json({ error: 'You can only delete your own reviews' });
    }

    // Delete review
    await Review.findByIdAndDelete(req.params.reviewId);

    // Update user's review count
    const user = await require('../models/User').findById(req.session.userId);
    user.profile.totalReviews = Math.max(0, user.profile.totalReviews - 1);
    await user.save();

    res.json({
      message: 'Review deleted successfully',
      deletedId: req.params.reviewId
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review', details: error.message });
  }
});

// GET - Get user's own reviews
router.get('/user/my-reviews', isAuthenticated, async (req, res) => {
  try {
    const userReviews = await Review.find({ userId: req.session.userId })
      .populate('bookId', 'title author isbn')
      .sort({ createdAt: -1 });
    
    res.json({
      username: req.session.username,
      reviews: userReviews,
      totalReviews: userReviews.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user reviews', details: error.message });
  }
});

module.exports = router;
