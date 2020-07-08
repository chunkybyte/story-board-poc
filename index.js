const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');

// Load the config
dotenv.config({
    path: './config/config.env' // this is where we put all our global variables 
});

// Passport Config
require('./config/passport')(passport);

// Make the database connection
connectDB();

const app = express();

// Body Parser to accept form data
app.use(express.urlencoded( { extended: false } ));
app.use(express.json());

// Method Override
app.use(
    methodOverride(function (req, res) {
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
            // look in urlencoded POST bodies and delete it
            let method = req.body._method;
            delete req.body._method;
            return method;
        }
    })
);

// Logging
if (process.env.NODE_ENV) {
    app.use(morgan('dev'));
}

// Handlerbars Helpers
const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs');
const { nextTick } = require('process');

// Handlebars
app.engine('.hbs', exphbs({
    helpers: {
        formatDate,
        truncate,
        stripTags,
        editIcon,
        select
    },
    defaultLayout: 'main', 
    extname: '.hbs'}));
app.set('view engine', '.hbs');

// Sessions
app.use(session({
  secret: 'story-board-secret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global variable
app.use(function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.use('/', require('./routes/app'));
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000;

app.listen(
    PORT,
    console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}`)
);