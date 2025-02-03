// bring in all reuquired functions and libraries
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const validPassword = require("../lib/passwordUtils").validPassword;
const db = require("../db/queries");

// function that runs when the password needs to be verified
const verifyCallback = async(username, password, done) => {
    console.log('verifying the callback now....');
    const user = await db.getUserByName(username);

    if (!user) {
        console.log('The user was not found');
        return done(null,false);
    }   
    console.log('the user hash is...', user.hash);
    const isValid = await validPassword(password, user.hash);

    if (isValid) {
        console.log('the user was found');
        return done(null,user);
    } else {
        return done(null,false);
    }
};

// Initialise the local strategy
const strategy = new LocalStrategy(verifyCallback);
passport.use(strategy);

// Define the serialise and deserialise functions
passport.serializeUser((user,done)=>{
    done(null, user.id); // store the user's ID value
})

passport.deserializeUser(async (userId, done)=>{
    try {
        const user = await db.getUserById(userId);
        done(null,user);
    } catch (err) {
        done(err);
    }
})