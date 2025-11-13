// middleware/authMiddleware.js

// Ensures only non-logged-in users can access certain routes (like login/register)
function ensureGuest(req, res, next) {
  if (req.session && req.session.userId) {
    // If already logged in, redirect to dashboard
    return res.redirect("/dashboard");
  }
  next();
}

// Ensures only logged-in users can access protected routes (like dashboard)
function ensureAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    // If not logged in, redirect to login
    return res.redirect("/login");
  }
  next();
}

module.exports = { ensureGuest, ensureAuth };
