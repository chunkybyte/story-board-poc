const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
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

// Logging
if (process.env.NODE_ENV) {
    app.use(morgan('dev'));
}

// Handlebars
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
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

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Routing
app.use('/', require('./routes/app'));
app.use('/auth', require('./routes/auth'))

const PORT = process.env.PORT || 3000;

app.listen(
    PORT,
    console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}`)
);