const db = require("../db/queries");
const genPassword = require("../lib/passwordUtils").genPassword;
const passport = require("passport");
const convertSize = require("../lib/convertSize");

module.exports = {
    indexGet: async (req, res, done) => {

        // if the user is logged in, get the user Id and rootFolder
        if (req.isAuthenticated()) {

            const userId = req.user.id;
            let rootFolder = await db.getRootFolder(userId);

            // if root folder doesn't exist, create one
            if (!rootFolder) {
                await db.createFolder(null, userId, 'My Drive');
                rootFolder = await db.getRootFolder(userId);
            }

            // get all children folders and files
            const getChildrenContents = await db.getFolderContents(rootFolder.id);
            
            // redirect to user's root folder
            res.redirect(`/folders/${rootFolder.id}`);
        } else {
            res.render("pages/splashscreen");
        }
    },
    folderGet: async(req,res,done) => {
        // get current folder
        const folderId = Number(req.params.folderId);
        const currFolder = await db.getFolderById(folderId);

        // get all child folders and files
        const children = await db.getFolderContents(folderId);

        // get current path
        const path = await db.getCurrentPath(folderId);
        const reversedPath = path.reverse();
        console.log(children);
        res.render("pages/home", {
            currFolder: currFolder,
            children: children,
            path: path,
            userMessage: res.locals.userMessage,
        });
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
    // POST ROUTES

    // Handle the user creating a new folder
    folderPost: async (req,res,done) => {
       const currFolder = Number(req.params.folderId);
        
       // create a new folder with the current folderId as the parent
       try {
        await db.createFolder(currFolder, req.user.id, req.body.folderName);
        res.locals.userMessage = 'File Uploaded!!'
       } catch (err) {
        console.error(err);
       }
       res.redirect(`/folders/${currFolder}`);
    },

    loginPost: passport.authenticate("local",
        {
            successRedirect: "/", failureRedirect: "/login",
        }
    ),
    
    uploadPost: async (req,res,done) => {
        const file = req.file;
        const userId = req.user.id;
        const parentId = req.params.folderId;
        

        // create file reference
        await db.createFile(Number(parentId), userId, file.originalname, file.path, file.size);

        setTimeout(()=>{
            res.redirect(`/folders/${req.params.folderId}`);
        }, 3000);
    },

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