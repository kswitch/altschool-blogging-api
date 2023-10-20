require('dotenv').config();

const Post = require('../models/blogPost');
const connectToDatabase = require('../middleware/connectToDatabase');


const deletePost = async (req, res, next) => {
    const postId = req.params.postId;

    const db = await connectToDatabase(
        process.env.MONGODB_POST_USER,
        process.env.MONGODB_POST_PASS,
        process.env.MONGODB_CLUSTER,
        process.env.MONGODB_POSTS_DATABASE
    );
    
    Post.findById(postId)
      .then(post => {
        if (!post) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        // Check logged in user and check the priviledges
        if (post.creator.toString() !== req.userId) {
          const error = new Error('Not authorized!');
          error.statusCode = 403;
          throw error;
        }
        return Post.findByIdAndDelete(postId);
      })
      .then(() => {
        res.status(200).json({ message: 'Deleted post Successfully.' });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      })
      .finally(() => db.connection.close());
}

module.exports = deletePost;