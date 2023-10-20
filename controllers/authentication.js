const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const signUpUser = require('../middleware/signUpUser');

exports.signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  return signUpUser;
};