const db = require("../db/queries");
const genPassword = require("../lib/passwordUtils").genPassword;
const passport = require("passport");


module.exports = {
    indexGet: async (req, res, done) => {

        if (req.user) {
            const userId = req.user.id;
            console.log('userid:', userId);

            // get the user's root folder and contents
            const rootFolder = await db.getRootFolderId(userId);
            const getChildrenContents = await db.getFolderContents(rootFolder.id);
            res.render("pages/home", { currentFolder: rootFolder });
        } else {
            res.render("pages/splashscreen");
        }
    },
    folderGet: async(req,res,done) => {
        res.send("test");
    },
    loginGet: (req, res, done) => {
        req.user ? res.redirect("/") : res.render("pages/login");
    },
    registerGet: (req, res, done) => {
        req.user ? res.redirect("/") : res.render("pages/register");
    },
    logout: (req, res, next) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            res.redirect("/");
        });
    },
    loginPost: passport.authenticate("local",
        {
            successRedirect: "/", failureRedirect: "/login",
        }
    ),
    registerPost: async (req, res, done) => {
        // get the form body
        const data = req.body;
        const pw = req.body.password;
        const hashedPw = await genPassword(pw);
        // add new user to database and create their first Folder
        try {
            await db.createUser(req.body.username, req.body.firstName, req.body.lastName, hashedPw);
            console.log('Successfully created user');
        } catch (err) {
            console.error(err);
        }
        res.redirect("/login");
    }
}