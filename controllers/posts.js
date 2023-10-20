require("dotenv").config();

const { validationResult } = require('express-validator');

const Post = require("../models/blogPost");
const User = require("../models/user");
const connectToDatabase = require("../middleware/connectToDatabase");
const getPostBySearch = require("../middleware/getPostBySearch");
const getAllPosts = require("../middleware/getAllPosts");
const deletePost = require("../middleware/deletePost");

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

    const { title, description, body, tags } = req.body;

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

    const post = new Post({
        title: title,
        description: description,
        author: () => User.findById(req.userId).then(user => user.name),
        body: body,
        tags: tags.toLowerCase().split(/[\s, ]+/), // Split tags either by space or commas
        createdAt: Date.now(),
        updatedAt: Date.now(),
        published: true,
        get state() { return this.published ? 'published' : 'draft' }, //set state according to the published key
        read_count: 1,
        reading_time: `${Math.ceil(body.split(' ').length / 180)} mins`, //Calculate reading time base of 180 WPM
        creator: req.userId
    });

    post.save().then(() => {
       return User.findById(req.userId);
   })
    .then((user) => {
        res.status(201).json({
            message: "Post created successfully!",
            post: post,
            creator: { _id: user._id, name: user.name },
        });
    })
    .catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

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