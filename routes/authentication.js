const express = require('express');

const authController = require('../controllers/authentication');
const { validateSignUpInput, validateLoginDetails } = require('../middleware/validateInput');
const checkIfUserExist = require('../middleware/checkIfUserExist');

const router = express.Router();

// POST auth/signup
router.post('/signup', validateSignUpInput, checkIfUserExist, authController.signUp);

//POST auth/login
router.post('/login', validateLoginDetails, authController.login);


module.exports = router;