const express = require('express');
const router = express.Router();

const postController = require('../controllers/posts');
const isAuthenticated = require('../middleware/isAuthenticated');
const validatePost = require('../middleware/validateInput').validatePost;

//=== CREATE Operation ===//
// POST /blog/posts Create Post
router.post('/posts', validatePost, isAuthenticated, postController.createPost);

//=== READ Operations ===//
// GET /blog/posts
router.get('/posts', postController.getPosts); // Get All Posts or Specific Post

//==== UPDATE OPERATIONS ====//
//POST /blog/posts
router.post('/posts/:postId', validatePost, isAuthenticated, postController.updatePost);

//PUT /blog/posts
router.put('/posts/:postId', validatePost, isAuthenticated, postController.updatePost);

//PATCH /blog/posts
router.patch('/posts/:postId', validatePost, isAuthenticated, postController.updatePost);

//=== DELETE OPERATIONS ===//
//DELETE /blog/posts
router.delete('/posts/:postId', isAuthenticated, postController.deletePost);

module.exports = router;