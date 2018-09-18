const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const expressValidator = require('express-validator');

// Init Express
const app = express();

// Body parser middleware
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').MONGO_URI;

// Connect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set Public/Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
    secret: 'article express',
    resave: true,
    saveUninitialized: true
}));

// Express Messages Middleware
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express Validator Middleware
app.use(expressValidator());

// Import Routing
const indexRoute = require('./routes/indexRoute');
const articleRoute = require('./routes/articleRoute');
const authRoute = require('./routes/authRoute');

// Use Routes
app.use('/', indexRoute);
app.use('/article', articleRoute);
app.use('/auth', authRoute);

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server starting on port ${port}`));