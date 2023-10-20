const Post = require("../models/blogPost");
const User = require("../models/user");

const deletePost = (req, res, next) => {
    const postId = req.params.postId;
    
    Post.findById(postId)
      .then(post => {
        if (!post) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        // Check logged in user
        if (post.creator.toString() !== req.userId) {
          const error = new Error('Not authorized!');
          error.statusCode = 403;
          throw error;
        }
        return Post.findByIdAndDelete(postId);
      })
      .then(result => {
        return User.findById(req.userId);
      })
      .then(user => {
        user.posts.pull(postId);
        return user.save();
      })
      .then(result => {
        res.status(200).json({ message: 'Deleted post.' });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
}

module.exports = deletePost;