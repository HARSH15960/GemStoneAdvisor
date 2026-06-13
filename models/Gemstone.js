const mongoose = require('mongoose');

const GemstoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a gemstone name'],
    unique: true,
    trim: true
  },
  planet: {
    type: String,
    required: [true, 'Please specify the associated planet'],
    trim: true
  },
  benefits: {
    type: [String],
    required: [true, 'Please add at least one benefit'],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'Please add at least one benefit'
    }
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  wearDay: {
    type: String,
    required: [true, 'Please specify the best day to wear'],
    trim: true
  },
  metal: {
    type: String,
    required: [true, 'Please specify the recommended metal'],
    trim: true
  },
  priceRange: {
    type: String,
    required: [true, 'Please add a price range'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Please add a gemstone image URL or base64 representation']
  },
  zodiacSigns: {
    type: [String],
    required: [true, 'Please add compatible zodiac signs'],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'Please add at least one compatible zodiac sign'
    }
  },
  problemCategories: {
    type: [String],
    required: [true, 'Please add compatible problem categories'],
    validate: {
      validator: function(v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'Please add at least one compatible problem category'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Gemstone', GemstoneSchema);
