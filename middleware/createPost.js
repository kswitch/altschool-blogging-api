const Post = require("../models/blogPost");
const User = require("../models/user");

const createPost = (req, res, next) => {
    const { title, description, body, tags } = req.body;

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
        creator: User.findById(req.userId).then(user => user._id)// req.userId
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
}

module.exports = createPost;