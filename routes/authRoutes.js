const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require("../controllers/authController");

// Root - redirect to dashboard if logged in, otherwise to login
router.get("/", (req, res) => {
  if (req.session && req.session.userId) return res.redirect("/dashboard");
  return res.redirect("/login");
});

// render pages
router.get("/login", (req, res) => {
  res.render("login", { error_msg: null, success_msg: null });
});

router.get("/register", (req, res) => {
  res.render("register", { error_msg: null, success_msg: null });
});

// post handlers
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

module.exports = router;
