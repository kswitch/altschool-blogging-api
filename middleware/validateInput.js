const { body } = require('express-validator');

const validatePost = [
    body('title').trim().notEmpty().withMessage('Title of post is required'),
    body('description').trim().notEmpty().bail().withMessage('Description is required'),
    body('body').trim().notEmpty().bail().withMessage('Post body is required'),
    body('tags').trim().notEmpty().bail().withMessage('Please add some tags to your post')
];

const validateSignUpInput = [
    body('firstName').trim().notEmpty().withMessage('Please enter your First Name'),
    body('lastName').trim().notEmpty().bail().withMessage('Please enter your Last Name'),
    body('email').trim().notEmpty().isEmail().bail().withMessage('Please enter a valid email'),
    body('password').trim().notEmpty().isLength({ min: 5 }).bail().withMessage('Please enter a password with minimum length of five characters')
];

const validateLoginDetails = [
    body('email').trim().notEmpty().isEmail().bail().withMessage('Please enter a valid email'),
    body('password').trim().notEmpty().bail().withMessage('Please enter a password')
]

module.exports = { validatePost, validateSignUpInput, validateLoginDetails };