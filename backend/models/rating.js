const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: String, // Using game.id (not MongoDB _id)
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  }
}, {
  timestamps: true
});

// Create compound index to ensure one rating per user per game
RatingSchema.index({ userId: 1, gameId: 1 }, { unique: true });

const Rating = mongoose.model('Rating', RatingSchema);
module.exports = Rating;

