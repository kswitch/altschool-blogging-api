const Post = require("../models/blogPost");

const getPostBySearch = (req, res, next) => {

    const { author, title, tags } = req.query;

    // Use Regex Expression when sending search to MongoDB so that it can be CASE-INSENSITIVE
    // Solution gotten from https://stackoverflow.com/questions/494035/how-do-you-use-a-variable-in-a-regular-expression
    
    Post.find({tags: new RegExp(tags,"i"), author: new RegExp(author,"i"), title: new RegExp(title, "i")})
        .then((posts) => {
            if (!posts.length) {
                const error = new Error("Could not find post.");
                error.statusCode = 404;
                next(error);
                throw error;
            }
            res.status(200).json({ message: posts.length === 1 ? 'Post fetched' : 'Posts fetched', posts: posts });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            return next(err);
        });
};

module.exports = getPostBySearch