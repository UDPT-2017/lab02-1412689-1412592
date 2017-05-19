// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app      = express();
var port     = process.env.PORT || 3500;

var passport = require('passport');
var flash    = require('connect-flash');

// configuration ===============================================================
// connect to our database
const pool = require('./app/models/pg');
require('./config/passport')(passport, pool); // pass passport for configuration



// set up our express application
require('./app/models/express')(app, morgan, cookieParser, bodyParser, express, passport, flash, session);

// routes ======================================================================
require('./route/routes.js')(app, passport, pool); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log(`The magic happens on port  ${port}`);
