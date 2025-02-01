require("dotenv").config(); // load in environment variables

// required modules
const express = require("express");
const session = require("express-session");
const routes = require("./routes/index");
const path = require("node:path");
const { PrismaClient } = require('@prisma/client');
const sessionStore = require("./config/session");
const passport = require("passport");

// required Passport config module
require("./config/passportConfig");

const app = express(); // create the express app
app.use(express.json()); // parses all incoming requests with JSON payload
app.use(express.urlencoded({exetended: true})); // parse incoming requst bodies that are URL encoded

// set the view engines and middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(session);
app.use(sessionStore);
app.use(passport.session());

// ROUTES
app.use(routes);

// SERVER
app.listen(3000, ()=> console.log('SERVER IS RUNNING'));