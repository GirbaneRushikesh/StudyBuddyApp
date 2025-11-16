const express = require("express");
const router = express.Router();

// Render login page
router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

// Handle login (replace with real auth logic/controllers)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.render("login", { error_msg: "Email and password required" });
  // TODO: real auth -> set req.session.userId, etc.
  return res.redirect("/dashboard");
});

// Render register page
router.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});

module.exports = router;
