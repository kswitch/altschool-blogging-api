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

    const postsDB = await connectToDatabase(
        process.env.MONGODB_POST_USER,
        process.env.MONGODB_POST_PASS,
        process.env.MONGODB_CLUSTER,
        process.env.MONGODB_POSTS_DATABASE
    );

    const usersDB = await connectToDatabase(
        process.env.MONGODB_POST_USER, //This MongoDB username cannot write to the UsersDatabase, please fix
        process.env.MONGODB_POST_PASS,
        process.env.MONGODB_CLUSTER,
        process.env.MONGODB_USERS_DATABASE
    );

    createPost(req, res, next);
    
    // Close Database Connections
    postsDB.connection.close();
    return usersDB.connection.close();
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

    const client = await connectToDatabase(
        process.env.MONGODB_POST_USER,
        process.env.MONGODB_POST_PASS,
        process.env.MONGODB_CLUSTER,
        process.env.MONGODB_POSTS_DATABASE
    );
    
    updatePost(req, res, next);

    // Close Database Connections
    return client.connection.close();
}

exports.deletePost = async (req, res, next) => {
    const postsDB = await connectToDatabase(
        process.env.MONGODB_POST_USER,
        process.env.MONGODB_POST_PASS,
        process.env.MONGODB_CLUSTER,
        process.env.MONGODB_POSTS_DATABASE
    );

    const usersDB = await connectToDatabase(
        process.env.MONGODB_ADDUSER_USER,
        process.env.MONGODB_ADDUSER_PASS,
        process.env.MONGODB_CLUSTER,
        process.env.MONGODB_USERS_DATABASE
    );

    deletePost(req, res, next);

    // Close Database Connections
    postsDB.connection.close();
    return usersDB.connection.close();
};