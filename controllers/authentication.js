const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const signUpUser = require('../middleware/signUpUser');
const loginUser = require('../middleware/loginUser');

exports.signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    next(error)
    throw error;
  }
  return signUpUser(req, res, next);
};

exports.login = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    next(error)
    throw error;
  }

  return loginUser(req, res, next);
}