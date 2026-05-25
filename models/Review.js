const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 2000
  },
  helpful: {
    type: Number,
    default: 0
  },
  unhelpful: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create unique index: one review per user per book
reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

// Method to update book rating when review changes
reviewSchema.post('save', async function(doc) {
  const Review = this.constructor;
  const reviews = await Review.find({ bookId: doc.bookId });
  
  if (reviews.length > 0) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await mongoose.model('Book').findByIdAndUpdate(
      doc.bookId,
      {
        'ratings.averageRating': parseFloat(avgRating.toFixed(2)),
        'ratings.totalRatings': reviews.length
      }
    );
  }
});

// Update book rating when review is deleted
reviewSchema.post('findByIdAndDelete', async function(doc) {
  if (doc) {
    const Review = this.model;
    const reviews = await Review.find({ bookId: doc.bookId });
    
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await mongoose.model('Book').findByIdAndUpdate(
        doc.bookId,
        {
          'ratings.averageRating': parseFloat(avgRating.toFixed(2)),
          'ratings.totalRatings': reviews.length
        }
      );
    } else {
      await mongoose.model('Book').findByIdAndUpdate(
        doc.bookId,
        {
          'ratings.averageRating': 0,
          'ratings.totalRatings': 0
        }
      );
    }
  }
});

module.exports = mongoose.model('Review', reviewSchema);
