const express = require('express');
const router = express.Router();

// root: redirect based on session
router.get('/', (req, res) => {
  if (req.session && req.session.userId) return res.redirect('/dashboard');
  return res.redirect('/login');
});

// Mount other route groups here for clarity if you prefer central routing:
// router.use('/auth', require('./authRoutes'));
// router.use('/notes', require('./noteRoutes'));

module.exports = router;