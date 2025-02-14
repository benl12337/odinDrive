const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController");
const multer = require('multer');
const upload = multer({dest: 'public/uploads'});


// GET ROUTES
indexRouter.get("/", indexController.indexGet);
indexRouter.get("/folders/:folderId", indexController.folderGet);
indexRouter.get("/items/:itemId", indexController.itemGet);
indexRouter.get("/login", indexController.loginGet);
indexRouter.get("/register",indexController.registerGet);
indexRouter.get("/logout", indexController.logout);

// POST ROUTES
indexRouter.post("/login", indexController.loginPost);
indexRouter.post("/folders/:folderId", indexController.folderPost); // create a new folder
indexRouter.post("/upload/folders/:folderId", upload.single('file'), indexController.uploadPost); // upload a file to specified folder
indexRouter.post("/register", indexController.registerPost);

module.exports = indexRouter;