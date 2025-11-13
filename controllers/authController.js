const User = require("../models/User");

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.render("register", { error_msg: "All fields are required", success_msg: null });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.render("register", { error_msg: "Email already registered", success_msg: null });
    }

    const user = new User({ username: username.trim(), email: email.toLowerCase().trim(), password });
    await user.save();

    req.session.userId = user._id;
    req.session.username = user.username;

    return res.redirect("/dashboard");
  } catch (err) {
    console.error("Register error:", err.stack || err);
    // show a friendly message in UI; include minimal detail in dev if needed
    return res.render("register", { error_msg: "Something went wrong. Check server logs.", success_msg: null });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.render("login", { error_msg: "Email and password are required", success_msg: null });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.render("login", { error_msg: "Invalid credentials", success_msg: null });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return res.render("login", { error_msg: "Invalid credentials", success_msg: null });
    }

    req.session.userId = user._id;
    req.session.username = user.username;
    return res.redirect("/dashboard");
  } catch (err) {
    console.error("Login error:", err.stack || err);
    return res.render("login", { error_msg: "Error logging in. Check server logs.", success_msg: null });
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};
