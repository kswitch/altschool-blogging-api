require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const connectToDatabase = require('./connectToDatabase');

const signUpUser = async (req, res, next) => {

    console.log('Signing Up Now!');

    const first_name = req.body.firstName;
    const last_name = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;

    const client = await connectToDatabase(
        process.env.MONGODB_ADDUSER_USER,
        process.env.MONGODB_ADDUSER_PASS,
        process.env.MONGODB_CLUSTER,
        process.env.MONGODB_USERS_DATABASE
    );

    bcrypt
        .hash(password, 12)
        .then( hashedPassword => {
            const user = new User({
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: hashedPassword,
                userCreatedAt: Date.now(),
                isActive: true
            });
            return user.save();
        })
        .then(result => {
            res.status(201).json({ message: 'Signed Up Successfully!', userId: result._id });
            client.connection.close();
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            client.connection.close();
            next(err);
        });

}

module.exports = signUpUser;