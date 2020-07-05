const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load the config
dotenv.config({
    path: './config/config.env' // this is where we put all our global variables 
});

// Make the database connection
connectDB();

const app = express();

const PORT = process.env.PORT || 3000;

app.listen(
    PORT,
    console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}`)
);