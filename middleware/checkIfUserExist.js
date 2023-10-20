require('dotenv').config();

const User = require('../models/user');
const connectToDatabase = require('./connectToDatabase');

const checkIfUserExist =  async (req, res, next) => {
    const { email } = req.body;

    const client = await connectToDatabase(
        process.env.MONGODB_POST_USER,
        process.env.MONGODB_POST_PASS,
        process.env.MONGODB_CLUSTER,
        process.env.MONGODB_USERS_DATABASE
    );

    return User.findOne({email: email})
        .then(user => {
            if (!user) {
                console.log('Email not in database')
                client.connection.close();
                next();
            }
            else {
                const error = new Error('E-Mail address already exists!');
                error.statusCode = 409;
                throw error;
            }
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

module.exports = checkIfUserExist;