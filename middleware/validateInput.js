const { body } = require('express-validator');

const validateInput = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().bail().withMessage('Description is required'),
    body('body').trim().notEmpty().bail().withMessage('Blog body is required'),
    body('tags').trim().notEmpty().bail().withMessage('Please add some tags to your post')
];

module.exports = validateInput