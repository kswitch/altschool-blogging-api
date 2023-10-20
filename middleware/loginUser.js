require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const connectToDatabase = require('./connectToDatabase');

const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    const client = await connectToDatabase(
        process.env.MONGODB_POST_USER,
        process.env.MONGODB_POST_PASS,
        process.env.MONGODB_CLUSTER,
        process.env.MONGODB_USERS_DATABASE
    );

    let foundUser;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error('Wrong Email or Password');
                error.statusCode = 401;
                throw error;
            }
            foundUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isPasswordEqual => {
            if (!isPasswordEqual) {
                const error = new Error('Wrong Email or Password!');
                error.statusCode = 401;
                throw error;
            }

            const expTime = '1h'
            const token = jwt.sign({ 
                email: foundUser.email, 
                userId: foundUser._id.toString() 
            }, process.env.JWT_SECRET, { expiresIn: expTime });
            res.status(200).json({ token: token, userId: foundUser._id.toString(), expiresIn: expTime });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 401;
            }
            client.connection.close(); //Always close connections
            next(err);
        })

}

module.exports = loginUser;