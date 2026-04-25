const Post = require('../models/Post');
const path = require('path');
const fs = require('fs');

// Get all posts with pagination and filtering
exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const sortBy = req.query.sortBy || 'createdAt'; // createdAt, likes
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build filter object
    const filter = { status: 'approved' };
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get posts with pagination
    const posts = await Post.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .select('-likedBy') // Don't send likedBy array to frontend for privacy
      .lean(); // Convert to plain JavaScript objects for better performance

    // Get total count for pagination info
    const totalPosts = await Post.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limit);

    // Add image URL to each post
    const postsWithImageUrls = posts.map(post => {
      let imageUrl;
      // Always construct the full URL with protocol and host
      if (post.image.path.startsWith('/uploads/')) {
        imageUrl = `${req.protocol}://${req.get('host')}${post.image.path}`;
      } else if (post.image.path.startsWith('/images/')) {
        imageUrl = `${req.protocol}://${req.get('host')}${post.image.path}`;
      } else {
        // For backward compatibility, construct URL based on filename
        imageUrl = `${req.protocol}://${req.get('host')}/uploads/${post.image.filename}`;
      }
      
      console.log('Generated imageUrl:', imageUrl, 'for post:', post._id);
      
      return {
        ...post,
        imageUrl
      };
    });

    res.json({
      success: true,
      data: postsWithImageUrls,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch posts' 
    });
  }
};

// Get single post by ID
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).select('-likedBy');
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        error: 'Post not found' 
      });
    }

    // Add image URL
    let imageUrl;
    if (post.image.path.startsWith('/uploads/')) {
      imageUrl = `${req.protocol}://${req.get('host')}${post.image.path}`;
    } else if (post.image.path.startsWith('/images/')) {
      imageUrl = `${req.protocol}://${req.get('host')}${post.image.path}`;
    } else {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${post.image.filename}`;
    }
    
    console.log('Single post imageUrl:', imageUrl, 'for post:', post._id);
    
    const postWithImageUrl = {
      ...post.toObject(),
      imageUrl
    };

    res.json({
      success: true,
      data: postWithImageUrl
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch post' 
    });
  }
};

// Create new post
exports.createPost = async (req, res) => {
  try {
    const { title, description, category, author } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({ 
        success: false, 
        error: 'Title, description, and category are required' 
      });
    }

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'Image is required' 
      });
    }

    // Create new post
    const newPost = new Post({
      title: title.trim(),
      description: description.trim(),
      category,
      author: author?.trim() || 'Anonymous',
      image: {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size
      },
      ecoPoints: calculateEcoPoints(category) // Assign points based on category
    });

    const savedPost = await newPost.save();

    // Return post with image URL
    let imageUrl;
    if (savedPost.image.path.startsWith('/uploads/')) {
      imageUrl = `${req.protocol}://${req.get('host')}${savedPost.image.path}`;
    } else if (savedPost.image.path.startsWith('/images/')) {
      imageUrl = `${req.protocol}://${req.get('host')}${savedPost.image.path}`;
    } else {
      imageUrl = `${req.protocol}://${req.get('host')}/uploads/${savedPost.image.filename}`;
    }
    
    console.log('Created post imageUrl:', imageUrl, 'for new post:', savedPost._id);
    
    const postWithImageUrl = {
      ...savedPost.toObject(),
      imageUrl
    };

    res.status(201).json({
      success: true,
      message: 'Post created successfully!',
      data: postWithImageUrl
    });

  } catch (error) {
    console.error('Error creating post:', error);
    
    // Delete uploaded file if post creation fails
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    res.status(500).json({ 
      success: false, 
      error: 'Failed to create post' 
    });
  }
};

// Like/unlike post
exports.toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.body.userId || req.ip; // Use IP as fallback for anonymous users

    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        error: 'Post not found' 
      });
    }

    // Check if user already liked the post
    const hasLiked = post.likedBy.includes(userId);

    if (hasLiked) {
      // Unlike: remove user from likedBy array and decrement likes
      post.likedBy = post.likedBy.filter(id => id !== userId);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // Like: add user to likedBy array and increment likes
      post.likedBy.push(userId);
      post.likes += 1;
    }

    await post.save();

    res.json({
      success: true,
      message: hasLiked ? 'Post unliked' : 'Post liked',
      data: {
        likes: post.likes,
        hasLiked: !hasLiked
      }
    });

  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to toggle like' 
    });
  }
};

// Add comment to post
exports.addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text, author } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Comment text is required' 
      });
    }

    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        error: 'Post not found' 
      });
    }

    // Add new comment
    const newComment = {
      text: text.trim(),
      author: author?.trim() || 'Anonymous',
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    // Return the newly added comment
    const addedComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: addedComment
    });

  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to add comment' 
    });
  }
};

// Delete post (for post owner)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        error: 'Post not found' 
      });
    }

    // Delete associated image file
    let imagePath;
    if (post.image.path.startsWith('/uploads')) {
      imagePath = path.join(__dirname, '..', 'uploads', post.image.filename);
    } else {
      imagePath = path.join(__dirname, '..', 'images', post.image.filename);
    }
    
    fs.unlink(imagePath, (err) => {
      if (err) console.error('Error deleting image file:', err);
    });

    // Delete post from database
    await Post.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete post' 
    });
  }
};

// Helper function to calculate eco points based on category
function calculateEcoPoints(category) {
  const pointsMap = {
    'tree-planting': 50,
    'recycling': 30,
    'energy-saving': 40,
    'water-conservation': 35,
    'other': 20
  };
  return pointsMap[category] || 20;
}
