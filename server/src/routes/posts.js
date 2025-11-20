const express = require('express');
const router = express.Router();
const { getAllPosts, createPost, deletePost } = require('../controllers/posts');

// GET all posts
router.get('/', getAllPosts);

// POST new post
router.post('/', createPost);

// DELETE post
router.delete('/:id', deletePost);

module.exports = router;