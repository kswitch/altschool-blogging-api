require('dotenv').config();

const User = require('../models/user');
const connectToDatabase = require('./connectToDatabase');

const checkIfUserExist =  async (req, res, next) => {
    const {email} = req.body.email;

    await connectToDatabase(
        process.env.MONGODB_POST_USER,
        process.env.MONGODB_POST_PASS,
        process.env.MONGODB_CLUSTER,
        process.env.MONGODB_USERS_DATABASE
    );

    return User.findOne({email: email})
        .then(user => {
            if(!user) {
               return next();
            }
            const error = new Error('E-Mail address already exists!');
            error.statusCode = 409;
            throw error;
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            return next(err);
        });
};

module.exports = checkIfUserExist;