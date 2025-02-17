require("dotenv").config(); // load in environment variables

// required modules
const express = require("express");
const session = require("express-session");
const flash = require('connect-flash');
const routes = require("./routes/index");
const path = require("node:path");
const sessionStore = require("./config/session");
const passport = require("passport");

// required Passport config module
require("./config/passportConfig");

const app = express(); // create the express app
app.use(express.json()); // parses all incoming requests with JSON payload
app.use(express.urlencoded({extended: true})); // parse incoming requst bodies that are URL encoded

// set the view engines and middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Sessions and Passport
app.use(sessionStore());
app.use(passport.initialize());
app.use(passport.session());

// ROUTES
app.use(flash());
app.use(routes);

// SERVER
app.listen(3000, ()=> console.log('SERVER IS RUNNING'));