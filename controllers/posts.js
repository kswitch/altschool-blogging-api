require("dotenv").config();

const { validationResult } = require('express-validator');

const connectToDatabase = require("../middleware/connectToDatabase");

// CRUD Imports
const createPost = require("../middleware/createPost");
const getAllPosts = require("../middleware/getAllPosts");
const getPostBySearch = require("../middleware/getPostBySearch");
const updatePost = require("../middleware/updatePost");
const deletePost = require("../middleware/deletePost");

exports.createPost = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error("Validation failed, entered data is incorrect.");
        error.statusCode = 422;
        next(error);
    }

    return createPost(req, res, next);
};

exports.getPosts = async (req, res, next) => {

    await connectToDatabase(
        process.env.MONGODB_PUBLIC_USER,
        process.env.MONGODB_PUBLIC_PASS,
        process.env.MONGODB_CLUSTER,
        process.env.MONGODB_POSTS_DATABASE
    );

    if (Object.keys(req.query).length > 0) { // Check if there are queries sent with the request
        return getPostBySearch(req, res, next);
    }
    else {
        return getAllPosts(req, res, next);
    }
};

exports.updatePost = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        next(error);
    }
    
    return updatePost(req, res, next);
}

exports.deletePost = async (req, res, next) => {
    return deletePost(req, res, next);
};