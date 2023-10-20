const Post = require("../models/blogPost");

const getAllPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const postsPerPage = 20;
    
    try {
        const totalItems = await Post.find().countDocuments();
        const posts = await Post.find()
            .skip((currentPage - 1) * postsPerPage)
            .limit(postsPerPage);

        res.status(200).json({
            message: "Fetched posts successfully.",
            posts: posts,
            totalItems: totalItems,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        return next(error);
    }
}

module.exports = getAllPosts