const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { upload, handleMulterError } = require('../middleware/upload');

// GET /api/posts - Get all posts with pagination and filtering
router.get('/', postController.getAllPosts);

// GET /api/posts/:id - Get single post by ID
router.get('/:id', postController.getPostById);

// POST /api/posts - Create new post with image upload
router.post('/', 
  upload, 
  handleMulterError, 
  postController.createPost
);

// PUT /api/posts/:id/like - Toggle like on post
router.put('/:id/like', postController.toggleLike);

// POST /api/posts/:id/comments - Add comment to post
router.post('/:id/comments', postController.addComment);

// DELETE /api/posts/:id - Delete post (optional)
router.delete('/:id', postController.deletePost);

module.exports = router;

