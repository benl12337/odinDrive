const db = require("../db/queries");
const genPassword = require("../lib/passwordUtils").genPassword;
const passport = require("passport");
const convertSize = require("../lib/convertSize");
const supabase = require("../lib/supabase");

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
    folderGet: async (req, res, done) => {
        // get current folder
        const folderId = Number(req.params.folderId);
        const currFolder = await db.getItemById(folderId);

        // get all child folders and files
        const children = await db.getFolderContents(folderId);
        const formattedChildren = children.map((child) => {

            return {
                ...child,
                size: child.size ? convertSize(child.size) : '-',
                created: child.created.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                })
            }
        });

        // get current path
        const path = await db.getCurrentPath(folderId);
        const reversedPath = path.reverse();

        res.render("pages/home", {
            currFolder: currFolder,
            children: formattedChildren,
            path: path,
        });
    },

    // get the item details
    itemGet: async (req, res, done) => {
        const itemId = Number(req.params.itemId);
        const currItem = await db.getItemById(itemId);
        const path = (await db.getCurrentPath(itemId)).reverse();

        const item = {
            ...currItem,
            size: convertSize(currItem.size),
            created: currItem.created.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
            )
        }

        res.render("pages/item", { item: item, path: path });
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
    folderPost: async (req, res, done) => {
        const currFolder = Number(req.params.folderId);

        // create a new folder with the current folderId
        // Ensure folder name does not already exists
        const folderValid = await db.verifyName(req.body.folderName, 'FOLDER', currFolder);
        if (folderValid) {
            try {
                await db.createFolder(currFolder, req.user.id, req.body.folderName);
            } catch (err) {
                console.error(err);
            }
        }
        res.redirect(`/folders/${currFolder}`);
    },
    
    // Update the name of a folder
    itemPost: async (req,res,done) => {
        const currItemId = Number(req.params.itemId);
        const currItem = await db.getItemById(currItemId);
        const folderValid = await db.verifyName(req.body.itemName, currItem.type, currItem.parentId);

        if (folderValid) {
            try {
                // update the item name
                await db.updateItem(currItemId, req.body.itemName);
            } catch(err) {
                console.error(err);
            }
        }
        res.redirect(`/folders/${currItem.parentId}`);
    },

    itemDelete: async(req,res,done) => {
        const currItemId = Number(req.params.itemId);
        const item = await db.getItemById(currItemId);
        const parentId = item.parentId;
        try {
            await db.deleteItem(currItemId);
        } catch (err) {
            console.error(err);
        }
        res.redirect(`/folders/${parentId}`);
    },

    loginPost: passport.authenticate("local",
        {
            successRedirect: "/", failureRedirect: "/login",
        }
    ),

    uploadPost: async (req, res, done) => {
        const file = req.file;
        const userId = req.user.id;
        const currFolder = await db.getItemById(Number(req.params.folderId));

        // the path should be the current folder name + the original file name
        const path = req.user.id + "/" + currFolder.name + file.originalname;

        // upload the file to supabase
        await supabase.uploadFile(req.file.buffer, path);

        // create file reference in db
        await db.createFile(Number(currFolder.id), userId, file.originalname, path, file.size);

        setTimeout(() => {
            res.redirect(`/folders/${req.params.folderId}`);
        }, 3000);
    },

    itemDownload: async (req,res,done) => {
        const item = await db.getItemById(Number(req.params.itemId));
        
        try {
            const data = await supabase.downloadFile(item.path);
            const fileBuffer = Buffer.from(await data.arrayBuffer());
            res.setHeader('Content-Disposition', `attachment; filename="${item.name}"`);
            res.setHeader('Content-Type', data.type); // Auto-detects file type
            
            res.send(fileBuffer);
        } catch(error) {
            console.log(error);
        }
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