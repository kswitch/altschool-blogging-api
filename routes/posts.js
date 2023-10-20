const express = require('express');
const router = express.Router();

const postController = require('../controllers/posts');
const isAuthenticated = require('../middleware/isAuthenticated');
const validatePost = require('../middleware/validateInput').validatePost;

// GET /blog/posts
router.get('/posts', postController.getPosts); // Get All Posts or Specific Post

// POST /blog/posts
router.post('/posts', validatePost, isAuthenticated, postController.createPost);

//DELETE /blog/posts
router.delete('/posts/:postId', isAuthenticated, postController.deletePost);

//PUT /blog/posts
router.put('/posts/:postId', validatePost, isAuthenticated, postController.updatePost);

//PATCH /blog/posts
router.patch('/posts/:postId', validatePost, isAuthenticated, postController.updatePost);


module.exports = router;