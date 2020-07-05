const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const connectDB = require('./config/db');

// Load the config
dotenv.config({
    path: './config/config.env' // this is where we put all our global variables 
});

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

// Routing
app.use('/', require('./routes/app'));

const PORT = process.env.PORT || 3000;

app.listen(
    PORT,
    console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}`)
);