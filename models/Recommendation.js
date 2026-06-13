const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: [true, 'Please add full name'],
    trim: true
  },
  gender: {
    type: String,
    required: [true, 'Please add gender'],
    enum: ['Male', 'Female', 'Other']
  },
  dob: {
    type: Date,
    required: [true, 'Please add date of birth']
  },
  zodiacSign: {
    type: String,
    required: [true, 'Please select a zodiac sign']
  },
  problemCategory: {
    type: String,
    required: [true, 'Please select a problem category'],
    enum: ['Career', 'Business', 'Money', 'Marriage', 'Education', 'Health']
  },
  recommendedGemstones: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gemstone'
  }],
  compatibilityScore: {
    type: Number,
    required: true,
    default: 90
  },
  planetStrength: {
    type: String,
    required: true,
    default: 'Strong'
  },
  whyExplanation: {
    type: String,
    required: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);
