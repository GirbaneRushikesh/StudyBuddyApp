const express = require('express');
const router = express.Router();

// show public home/landing when not logged in, otherwise dashboard
router.get('/', (req, res) => {
  if (req.session && req.session.userId) return res.redirect('/dashboard');
  // render a landing page if you have one; fallback to pages/about or simple view
  return res.render('pages/about', { title: 'Home' });
});

module.exports = router;