const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
  // existing login logic or placeholder
  const { email, password } = req.body;
  if (!email || !password) return res.render('login', { error_msg: 'Email and password required' });
  // auth -> set session -> redirect
  res.redirect('/dashboard');
});

module.exports = router;
