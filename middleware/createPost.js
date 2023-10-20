require('dotenv').config();

const Post = require("../models/blogPost");
const User = require("../models/user");
const connectToDatabase = require('../middleware/connectToDatabase');


const createPost = async (req, res, next) => {
    const { title, description, body, tags } = req.body;

    let author;

    const usersDB = await connectToDatabase(
        process.env.MONGODB_CHECKUSER_USER,
        process.env.MONGODB_CHECKUSER_PASS,
        process.env.MONGODB_CLUSTER,
        process.env.MONGODB_USERS_DATABASE
    );
    console.log('Connecting to database...');

    await User.findById(req.userId).then(user => {
        if (!user) {
            console.log('No User Found');
            author = '';
            
        }
        author = `${user.first_name} ${user.last_name}`;
        return usersDB.connection.close();
    });
    

    const postsDB = await connectToDatabase(
        process.env.MONGODB_POST_USER,
        process.env.MONGODB_POST_PASS,
        process.env.MONGODB_CLUSTER,
        process.env.MONGODB_POSTS_DATABASE
    );

    const post = new Post({
        title: title,
        description: description,
        author: author, 
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

    post.save()
        .then(() => {
            res.status(201).json({
                message: "Post created successfully!",
                post: post,
                creator: { _id: req.userId, author},
            });
        })
        .catch((err) => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
        .finally(() => postsDB.connection.close())
}

module.exports = createPost;