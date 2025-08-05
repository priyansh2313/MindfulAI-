const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true // Now required since we're providing user ID
  },
  score: {
    type: Number,
    required: true
  },
  categories: {
    anxiety: Number,
    depression: Number,
    insomnia: Number,
    stress: Number,
    selfEsteem: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Test', testSchema);