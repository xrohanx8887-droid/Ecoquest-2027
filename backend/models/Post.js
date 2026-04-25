const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    default: 'Anonymous'
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: ['tree-planting', 'recycling', 'energy-saving', 'water-conservation', 'other']
  },
  author: {
    type: String,
    required: true,
    default: 'Anonymous'
  },
  image: {
    filename: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    mimetype: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    }
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  likedBy: [{
    type: String // Store user IDs or session IDs
  }],
  comments: [commentSchema],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved' // For now, auto-approve posts
  },
  ecoPoints: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for better query performance
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ author: 1 });

module.exports = mongoose.model('Post', postSchema);

