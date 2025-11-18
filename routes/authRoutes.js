const express = require('express');
const router = express.Router();

// Import controller functions
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');

// -------------------- REGISTER ROUTES -------------------- //

// Render register page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// Handle register form
router.post('/register', registerUser);

// -------------------- LOGIN ROUTES -------------------- //

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', loginUser);

// -------------------- LOGOUT -------------------- //

router.get('/logout', logoutUser);

module.exports = router;
