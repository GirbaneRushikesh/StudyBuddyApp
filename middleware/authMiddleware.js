// Middleware to ensure user is authenticated
exports.ensureAuth = (req, res, next) => {
  if (!req.session.userId) return res.redirect("/");
  next();
};
