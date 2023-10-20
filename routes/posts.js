const router = require('express').Router();

const postController = require('../controllers/posts');
const isAuthenticated = require('../middleware/isAuthenticated');
const validateInput = require('../middleware/validateInput')

// GET /blog/posts
router.get('/posts', postController.getPosts); // Get All Posts or Specific Post

// POST /blog/posts
router.post('/posts', validateInput, isAuthenticated, postController.createPost);

//DELETE /blog/posts
router.delete('/posts/:postId', isAuthenticated, postController.deletePost);

// router.put(
//   '/post/:postId',
//    validateInput,
//   isAuthenticated,
//   postController.updatePost
// );


module.exports = router;