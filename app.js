// Import necessary modules
const express = require("express");
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const session = require('express-session');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const colors = require('colors');

// Import routers
const homeRouter = require('./routers/home.route');
// const deviceRouter = require('./routers/device.route');
const userRouter = require('./routers/user.route');

// Initialize Express app
const app = express();

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
const mongodb = require('./models/db');

// Set up session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload());

// Set up static file serving middleware
app.use(express.static(path.join(__dirname, 'assets'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// Set Pug as the view engine
app.set('view engine', 'pug');
app.set('views', './views');

// Use routers
app.use("/", homeRouter);
// app.use("/device", deviceRouter);
app.use("/user", userRouter);

// Set up server port
const PORT = process.env.PORT || 3200;
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`.green);
});
