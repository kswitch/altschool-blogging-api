const bcrypt = require('bcryptjs');
const User = require('../models/user');

const signUpUser = (req, res, next) => {

    const first_name = req.body.firstName;
    const last_name = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password; ``

    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
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
            res.status(201).json({ message: 'User created!', userId: result._id });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });

}

module.exports = signUpUser;