require("dotenv").config();

const { validationResult } = require('express-validator');

const connectToDatabase = require("../middleware/connectToDatabase");
const getPostBySearch = require("../middleware/getPostBySearch");
const getAllPosts = require("../middleware/getAllPosts");
const deletePost = require("../middleware/deletePost");
const updatePost = require("../middleware/updatePost");

exports.getPosts = async (req, res, next) => {

    await connectToDatabase(
        process.env.MONGODB_PUBLIC_USER,
        process.env.MONGODB_PUBLIC_PASS,
        process.env.MONGODB_CLUSTER,
        process.env.MONGODB_POSTS_DATABASE
    );

    if (Object.keys(req.query).length > 0) {
        return getPostBySearch(req, res, next);
    }
    else {
        return getAllPosts(req, res, next);
    }
};

exports.createPost = async (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed, entered data is incorrect.");
        error.statusCode = 422;
        next(error);
    }

    await connectToDatabase(
        process.env.MONGODB_POST_USER,
        process.env.MONGODB_POST_PASS,
        process.env.MONGODB_CLUSTER,
        process.env.MONGODB_POSTS_DATABASE
    );

    await connectToDatabase(
        process.env.MONGODB_POST_USER,
        process.env.MONGODB_POST_PASS,
        process.env.MONGODB_CLUSTER,
        process.env.MONGODB_USERS_DATABASE
    );

    return createPost(req, res, next);
};

exports.updatePost = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        next(error);
    }

    await connectToDatabase(
        process.env.MONGODB_POST_USER,
        process.env.MONGODB_POST_PASS,
        process.env.MONGODB_CLUSTER,
        process.env.MONGODB_POSTS_DATABASE
    );

    return updatePost(req, res, next);
}

exports.deletePost = async (req, res, next) => {
    await connectToDatabase(
        process.env.MONGODB_POST_USER,
        process.env.MONGODB_POST_PASS,
        process.env.MONGODB_CLUSTER,
        process.env.MONGODB_POSTS_DATABASE
    );

    await connectToDatabase(
        process.env.MONGODB_POST_USER, //This MongoDB username cannot write to the UsersDatabase, please fix
        process.env.MONGODB_POST_PASS,
        process.env.MONGODB_CLUSTER,
        process.env.MONGODB_USERS_DATABASE
    );

    return deletePost(req, res, next);
};