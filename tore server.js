[1mdiff --git a/server.js b/server.js[m
[1mindex 70423ac..25f997b 100644[m
[1m--- a/server.js[m
[1m+++ b/server.js[m
[36m@@ -9,70 +9,78 @@[m [mconst express = require("express");[m
 const path = require("path");[m
 const session = require("express-session");[m
 const MongoStore = require("connect-mongo");[m
[31m-const User = require("./models/User");[m
[32m+[m[32mlet User;[m
[32m+[m[32mtry {[m
[32m+[m[32m  User = require("./models/User");[m
[32m+[m[32m} catch (err) {[m
[32m+[m[32m  console.error("Failed to require models/User — available files in models/:");[m
[32m+[m[32m  const fs = require('fs');[m
[32m+[m[32m  console.error(fs.readdirSync(path.join(__dirname, 'models')));[m
[32m+[m[32m  throw err;[m
[32m+[m[32m}[m
 [m
 const app = express();[m
 [m
 // Middlewares[m
 app.use(express.urlencoded({ extended: true }));[m
[31m-app.use(express.json());[m
[31m-app.use(express.static(path.join(__dirname, "public")));[m
[31m-[m
[31m-// View engine[m
[31m-app.set("views", path.join(__dirname, "views"));[m
[31m-app.set("view engine", "ejs");[m
[31m-[m
[31m-// Session[m
 const sessionSecret = process.env.SESSION_SECRET || "change_this_secret";[m
[31m-app.use([m
[32m+[m[32mapp.use(express.static(path.join(__dirname, "public")));[m
   session({[m
     secret: sessionSecret,[m
[31m-    resave: false,[m
[31m-    saveUninitialized: false,[m
[32m+[m[32m    resave: false,ath.join(__dirname, "views"));[m
[32m+[m[32m    saveUninitialized: false,;[m
     store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),[m
     cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day[m
[31m-  })[m
[31m-);[m
[31m-[m
[32m+[m[32m  })t sessionSecret = process.env.SESSION_SECRET || "change_this_secret";[m
[32m+[m[32m);p.use([m
[32m+[m[32m  session({[m
 // Simple session-flash middleware: move any messages into res.locals and clear them[m
 app.use((req, res, next) => {[m
   res.locals.success_msg = req.session.success_msg || null;[m
[31m-  res.locals.error_msg = req.session.error_msg || null;[m
[32m+[m[32m  res.locals.error_msg = req.session.error_msg || null;NGO_URI }),[m
   res.locals.username = req.session.username || null;[m
   res.locals.theme = req.session.theme || null;[m
   delete req.session.success_msg;[m
   delete req.session.error_msg;[m
[31m-  next();[m
[31m-});[m
[31m-[m
[31m-// after session & res.locals population middleware[m
[31m-app.use(async (req, res, next) => {[m
[31m-  try {[m
[32m+[m[32m  next(); session-flash middleware: move any messages into res.locals and clear them[m
[32m+[m[32m});.use((req, res, next) => {[m
[32m+[m[32m  res.locals.success_msg = req.session.success_msg || null;[m
[32m+[m[32m// after session & res.locals population middlewareull;[m
[32m+[m[32mapp.use(async (req, res, next) => {.username || null;[m
[32m+[m[32m  try {ocals.theme = req.session.theme || null;[m
     if (req.session && req.session.userId) {[m
       const u = await User.findById(req.session.userId).select("tags displayName").lean();[m
       res.locals.userTags = (u && u.tags) ? u.tags : [];[m
       // keep username consistent with displayName[m
       if (u && u.displayName) res.locals.username = u.displayName;[m
[31m-      res.locals.user = u || null;[m
[31m-    } else {[m
[32m+[m[32m      res.locals.user = u || null;lation middleware[m
[32m+[m[32m    } else {c (req, res, next) => {[m
       res.locals.userTags = [];[m
[32m+[m[32m      res.locals.user = null;ssion.userId) {[m
[32m+[m[32m    } const u = await User.findById(req.session.userId).select("tags displayName").lean();[m
[32m+[m[32m  } catch (err) {userTags = (u && u.tags) ? u.tags : [];[m
[32m+[m[32m    console.error("user-loader:", err);displayName[m
[32m+[m[32m    res.locals.userTags = res.locals.userTags || [];u.displayName;[m
[32m+[m[32m  }   res.locals.user = u || null;[m
[32m+[m[32m  next();e {[m
[32m+[m[32m});   res.locals.userTags = [];[m
       res.locals.user = null;[m
[31m-    }[m
[31m-  } catch (err) {[m
[31m-    console.error("user-loader:", err);[m
[31m-    res.locals.userTags = res.locals.userTags || [];[m
[31m-  }[m
[31m-  next();[m
[31m-});[m
[31m-[m
 // Routes[m
 app.use("/", require("./routes/authRoutes"));[m
 app.use("/dashboard", require("./routes/dashboardRoutes"));[m
[31m-app.use("/notes", require("./routes/noteRoutes"));[m
[32m+[m[32mapp.use("/notes", require("./routes/noteRoutes"));];[m
 app.use("/profile", require("./routes/profileRoutes"));[m
 app.use("/", require("./routes/pagesRoutes"));[m
 app.use("/", require("./routes/health"));[m
 [m
[32m+[m[32m// 404tes[m
[32m+[m[32mapp.use((req, res) => res.status(404).render("404"));[m
[32m+[m[32mapp.use("/dashboard", require("./routes/dashboardRoutes"));[m
[32m+[m[32m// start"/notes", require("./routes/noteRoutes"));[m
[32m+[m[32mconst PORT = process.env.PORT || 3000;profileRoutes"));[m
[32m+[m[32mapp.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));[m
[32m+[m[32mapp.use("/", require("./routes/health"));[m
[32m+[m
 // 404[m
 app.use((req, res) => res.status(404).render("404"));[m
 [m
