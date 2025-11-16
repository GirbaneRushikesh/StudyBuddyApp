// load env first
require('dotenv').config();

// connect DB early
const connectDB = require('./config/db');
connectDB();

const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
// const User = require("./models/User");   <-- REMOVE this line
let User;
try {
  User = require("./models/User");
} catch (err) {
  User = null;
  console.warn("models/User not found or wrong-case on this system:", err.message || err);
}

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Session
const sessionSecret = process.env.SESSION_SECRET || "change_this_secret";
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// Flash / locals
app.use((req, res, next) => {
  res.locals.success_msg = req.session.success_msg || null;
  res.locals.error_msg = req.session.error_msg || null;
  res.locals.username = req.session.username || null;
  res.locals.theme = req.session.theme || null;
  delete req.session.success_msg;
  delete req.session.error_msg;
  next();
});

// Load user tags into views if logged in
app.use(async (req, res, next) => {
  try {
    if (req.session && req.session.userId && User) {
      const u = await User.findById(req.session.userId).select("tags displayName").lean();
      res.locals.userTags = (u && u.tags) ? u.tags : [];
      if (u && u.displayName) res.locals.username = u.displayName;
      res.locals.user = u || null;
    } else {
      res.locals.userTags = [];
      res.locals.user = null;
    }
  } catch (err) {
    console.error("user-loader:", err);
    res.locals.userTags = res.locals.userTags || [];
  }
  next();
});

// Routes (index mounted first)
app.use("/", require("./routes/index"));
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/pagesRoutes"));
app.use("/dashboard", require("./routes/dashboardRoutes"));
app.use("/notes", require("./routes/noteRoutes"));
app.use("/profile", require("./routes/profileRoutes"));
app.use("/", require("./routes/health"));

// 404 (last)
app.use((req, res) => res.status(404).render("404"));

// start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
