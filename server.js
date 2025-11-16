require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/db');

// connect to MongoDB (async)
connectDB().catch(err => {
  console.error('Failed to connect to DB at startup:', err);
  process.exit(1);
});

const app = express();

// safe require for User model (helpful on deploy if file casing differs)
let User;
try {
  User = require('./models/User');
} catch (err) {
  // helpful debug output — keeps behavior same on Windows and Linux
  console.error('Failed to load ./models/User. files in models/:', require('fs').readdirSync(path.join(__dirname, 'models')));
  throw err;
}

// view engine & static
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session (uses Mongo store)
const sessionSecret = process.env.SESSION_SECRET || 'change_this_secret';
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

// expose common locals
app.use((req, res, next) => {
  res.locals.username = req.session.username || null;
  res.locals.theme = req.session.theme || null;
  res.locals.success_msg = req.session.success_msg || null;
  res.locals.error_msg = req.session.error_msg || null;
  delete req.session.success_msg;
  delete req.session.error_msg;
  next();
});

// register routes (adjust as needed)
app.use('/', require('./routes/index'));
// example: app.use('/notes', require('./routes/notes'));

// simple health route
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
