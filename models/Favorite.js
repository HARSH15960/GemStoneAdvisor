const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gemstone: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gemstone',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Set up compound index to ensure uniqueness per user-gemstone pairing
FavoriteSchema.index({ user: 1, gemstone: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);
