const { Router } = require("express");
const indexRouter = Router();
const db = require("../db/queries");
const genPassword = require("../lib/passwordUtils").genPassword;
const passport = require("passport");

// GET ROUTES
indexRouter.get("/", (req,res,done)=>{
    // if user is already authenticated, send them to the app homescreen, otherwise show the splash screen
    req.user ? res.render("pages/home") : res.render("pages/splashscreen");
});

indexRouter.get("/login", (req,res,done)=>{
    res.render("pages/login");
})

indexRouter.get("/register", (req,res,done)=>{
    res.render("pages/register");
});

indexRouter.get("/logout", (req,res,next)=>{
    req.logout((err)=>{
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
})

// POST ROUTES

// authenticate the user upon login
indexRouter.post("/", passport.authenticate("local", { successRedirect: "/", failureRedirect: "/login", }),
);

// create user and redirect to home page
indexRouter.post("/register", async (req,res,done)=>{
    // get the form body
    const data = req.body;
    const pw = req.body.password;
    const hashedPw = await genPassword(pw);
    // add new user to database
    try {
        await db.createUser(req.body.username, req.body.firstName, req.body.lastName, hashedPw);
        console.log('Successfully created user');
    } catch (err) {
        console.error(err);
    }
    res.redirect("/");
});

module.exports = indexRouter;