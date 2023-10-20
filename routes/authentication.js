const express = require('express');

const authController = require('../controllers/authentication');
const validateSignUpDetails = require('../middleware/validateInput').validateSignUpInput;
const checkIfUserExist = require('../middleware/checkIfUserExist');

// const isAuth = require('../middleware/isAuthenticated');

const router = express.Router();

router.post('/signup', validateSignUpDetails, checkIfUserExist, authController.signUp);

module.exports = router;